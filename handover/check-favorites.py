"""Browser regression checks; pass the extracted index.html path as the first argument."""
import asyncio, csv, sys
from pathlib import Path
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width":1280,"height":1800})
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        await page.goto(Path(sys.argv[1]).resolve().as_uri())
        await page.evaluate("localStorage.removeItem('vt:handover:favorites')")
        await page.reload()
        only=page.get_by_role('checkbox',name='Favorites only')
        await only.check()
        assert await page.locator('main figure:visible').count()==0
        await only.uncheck()
        await page.get_by_role('button',name='Save favorite: Overview — Desktop',exact=True).click()
        await page.get_by_role('button',name='Save favorite: Overview — Tablet',exact=True).focus()
        await page.keyboard.press('Space')
        await page.reload()
        assert await page.locator('.favorite-toggle[aria-pressed="true"]').count()==2
        await only.check()
        assert await page.locator('main figure:visible').count()==2
        await page.locator('#module').select_option('dashboard')
        await page.locator('#search').fill('tablet')
        assert await page.locator('main figure:visible').count()==1
        await page.locator('#search').fill('')
        await page.locator('#variant').select_option('Tablet')
        assert await page.locator('main figure:visible').count()==1
        await page.locator('#variant').select_option('all')
        await page.locator('#compare-open').click()
        assert await page.locator('#compare-left option').count()==2
        await page.keyboard.press('Escape')
        async with page.expect_download() as pending:
            await page.locator('#export-list').click()
        download=await pending.value
        await download.save_as('/tmp/browser/favorites/saved.csv')
        rows=list(csv.reader(Path('/tmp/browser/favorites/saved.csv').read_text(encoding='utf-8-sig').splitlines()))
        assert len(rows)==3 and [r[1] for r in rows[1:]]==['Desktop','Tablet']
        await page.get_by_role('button',name='Preview Overview — Desktop',exact=True).first.click()
        await page.locator('#preview-next').click()
        assert await page.locator('#preview-title').inner_text()=='Overview — Tablet'
        await page.keyboard.press('Escape')
        await page.get_by_role('button',name='Remove favorite: Overview — Desktop',exact=True).click()
        assert await page.evaluate('document.activeElement.id')=='favorites-only'
        assert await page.locator('main figure:visible').count()==1
        await page.screenshot(path='/tmp/browser/favorites/desktop.png')
        await page.get_by_role('button',name='Remove favorite: Overview — Tablet',exact=True).click()
        assert await page.locator('main figure:visible').count()==0
        await page.locator('#clear').click()
        assert not await only.is_checked()
        assert await page.locator('main figure:visible').count()==39
        await page.get_by_role('button',name='Save favorite: Overview — Desktop',exact=True).click()
        await only.check()
        await page.set_viewport_size({'width':390,'height':844})
        await page.screenshot(path='/tmp/browser/favorites/mobile.png')
        assert await page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        await page.evaluate("() => { Storage.prototype.setItem=()=>{throw new Error('blocked')}; }")
        await page.get_by_role('button',name='Remove favorite: Overview — Desktop',exact=True).click()
        assert 'Browser storage unavailable' in await page.locator('#favorite-status').inner_text()
        assert not errors, errors
        print('PASS: saving/removing, keyboard access, reload persistence, combined filters, preview/comparison/export scope, focus recovery, empty state, clear filters, mobile layout, blocked-storage notice.')
        await browser.close()

asyncio.run(main())
