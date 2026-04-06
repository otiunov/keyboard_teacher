import { expect, test, type Page } from '@playwright/test'

type SpeechCall = {
  lang: string
  text: string
}

async function openLesson(page: Page) {
  await page.addInitScript(() => {
    const speechCalls: Array<{ lang: string; text: string }> = []

    Object.defineProperty(window, '__speechCalls', {
      configurable: true,
      value: speechCalls,
    })

    class MockSpeechSynthesisUtterance {
      lang = ''
      text = ''

      constructor(text: string) {
        this.text = text
      }
    }

    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        speak(utterance: { lang: string; text: string }) {
          speechCalls.push({
            text: utterance.text,
            lang: utterance.lang,
          })
        },
        cancel() {},
      },
    })

    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    })
  })

  await page.goto('/')
}

async function readSpeechCalls(page: Page): Promise<SpeechCall[]> {
  return page.evaluate(() => {
    return ((window as Window & { __speechCalls?: SpeechCall[] }).__speechCalls ?? []).slice()
  })
}

async function readCurrentTarget(page: Page) {
  return (await page.locator('.prompt-beacon__target').textContent())?.trim() ?? ''
}

function pickWrongKey(target: string) {
  return target === '1' ? '2' : '1'
}

function pickNextTargetValue(target: string) {
  return target === '8' ? 0.2 : 0.8
}

test.describe('Phase 1 numbers lesson', () => {
  test('renders the initial numbers lesson with one highlighted target', async ({ page }) => {
    await openLesson(page)
    const target = await readCurrentTarget(page)

    await expect(page.locator('main.stage')).toBeVisible()
    await expect(page.locator('.feedback-strip')).toContainText('Tap the glowing key')
    await expect(page.locator('.key-button--highlighted-target')).toHaveCount(1)
    await expect(page.getByRole('button', { name: target })).toHaveClass(/key-button--highlighted-target/)
    await expect
      .poll(async () => readSpeechCalls(page))
      .toEqual([{ text: target, lang: 'en-US' }])
  })

  test('keeps the target cue active after a wrong answer', async ({ page }) => {
    await openLesson(page)
    const target = await readCurrentTarget(page)
    const wrongKey = pickWrongKey(target)

    await page.getByRole('button', { name: wrongKey }).click()

    await expect(page.locator('.feedback-strip')).toContainText('Try again')
    await expect(page.locator('.feedback-strip')).toContainText(`Last key: ${wrongKey}`)
    await expect(page.getByRole('button', { name: target })).toHaveClass(/key-button--highlighted-target/)
    await expect(page.getByRole('button', { name: wrongKey })).toHaveClass(/key-button--incorrect/)
    await expect
      .poll(async () => readSpeechCalls(page))
      .toEqual([
        { text: target, lang: 'en-US' },
        { text: 'Try again', lang: 'en-US' },
      ])
  })

  test('correct answers advance to the next prompt and speak the new target', async ({ page }) => {
    await openLesson(page)
    const target = await readCurrentTarget(page)
    const nextTargetValue = pickNextTargetValue(target)
    const nextTarget = nextTargetValue === 0.8 ? '8' : '2'

    await page.evaluate((value) => {
      Math.random = () => value
    }, nextTargetValue)

    await page.getByRole('button', { name: target }).click()

    await expect(page.locator('.feedback-strip')).toContainText('Good job')
    await expect(page.getByRole('button', { name: target })).toHaveClass(/key-button--correct/)
    await expect(page.locator('.prompt-beacon__target')).toHaveText(nextTarget)
    await expect(page.locator('.feedback-strip')).toContainText('Tap the glowing key')
    await expect(page.locator('.feedback-strip')).toContainText('Last key: -')
    await expect(page.getByRole('button', { name: nextTarget })).toHaveClass(/key-button--highlighted-target/)
    await expect
      .poll(async () => readSpeechCalls(page))
      .toEqual([
        { text: target, lang: 'en-US' },
        { text: 'Good job', lang: 'en-US' },
        { text: nextTarget, lang: 'en-US' },
      ])
  })

  test('preserves the active round while switching languages in the parent drawer', async ({
    page,
  }) => {
    await openLesson(page)
    const target = await readCurrentTarget(page)
    const wrongKey = pickWrongKey(target)

    await page.getByRole('button', { name: wrongKey }).click()
    await page.getByRole('button', { name: /open parent settings/i }).click()
    await page.getByRole('button', { name: /polish/i }).click()

    await expect(page.getByText('Polish · Numbers')).toBeVisible()
    await expect(page.locator('.prompt-beacon__target')).toHaveText(target)
    await expect(page.locator('.feedback-strip')).toContainText('Try again')
    await expect(page.locator('.feedback-strip')).toContainText(`Last key: ${wrongKey}`)
    await expect(page.getByRole('button', { name: wrongKey })).toHaveClass(/key-button--incorrect/)
    await expect(page.getByRole('button', { name: target })).toHaveClass(/key-button--highlighted-target/)
    await expect
      .poll(async () => readSpeechCalls(page))
      .toEqual([
        { text: target, lang: 'en-US' },
        { text: 'Try again', lang: 'en-US' },
        { text: target, lang: 'pl-PL' },
      ])
  })

  test('accepts physical keyboard number input with the same feedback as on-screen keys', async ({
    page,
  }) => {
    await openLesson(page)
    const target = await readCurrentTarget(page)
    const wrongKey = pickWrongKey(target)

    await page.keyboard.press(wrongKey)

    await expect(page.locator('.feedback-strip')).toContainText('Try again')
    await expect(page.locator('.feedback-strip')).toContainText(`Last key: ${wrongKey}`)
    await expect(page.getByRole('button', { name: target })).toHaveClass(/key-button--highlighted-target/)
    await expect(page.getByRole('button', { name: wrongKey })).toHaveClass(/key-button--incorrect/)
    await expect
      .poll(async () => readSpeechCalls(page))
      .toEqual([
        { text: target, lang: 'en-US' },
        { text: 'Try again', lang: 'en-US' },
      ])
  })
})
