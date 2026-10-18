import { test, expect } from '@playwright/test'

test('a página inicial exibe o catálogo de NFTs', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Cosmic Bloom')).toBeVisible()
})

test('é possível adicionar um NFT aos favoritos', async ({ page }) => {
  await page.goto('/')

  const favoriteButton = page.getByRole('button', {
    name: 'Adicionar Cosmic Bloom aos favoritos',
  })

  await favoriteButton.click()

  await expect(
    page.getByRole('button', {
      name: 'Remover Cosmic Bloom dos favoritos',
    }),
  ).toBeVisible()

  await page.getByRole('link', { name: 'Meus favoritos' }).click()

  await expect(
    page.getByRole('heading', { name: 'Meus favoritos' }),
  ).toBeVisible()

  await expect(page.getByText('Cosmic Bloom')).toBeVisible()
})