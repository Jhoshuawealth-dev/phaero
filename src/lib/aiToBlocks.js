import { defaultBlockData } from '../components/BlockLibrary'
import { generateImageUrl } from './imageGen'

export function siteDataToBlocks(site) {
  return (site.blocks || []).map((type, i) => {
    const base = { ...defaultBlockData[type] }

    if (type === 'Hero Banner') {
      base.title = site.heroTitle || site.businessName || base.title
      base.subtitle = site.heroSubtitle || site.tagline || base.subtitle
      base.bgColor = site.bgColor || base.bgColor
      base.image = generateImageUrl(`${site.businessName || 'business'}, ${site.imagePrompt || 'professional photo, African business, high quality'}`, 1200, 600)
    }
    if (type === 'About Section') {
      base.title = `About ${site.businessName || 'Us'}`
      base.body = site.aboutBody || base.body
    }
    if (type === 'Services' && site.services?.length) {
      const colors = ['#8B4513', '#2F4F4F', '#1a3a5c']
      base.items = site.services.slice(0, 3).map((name, j) => ({ name, color: colors[j % 3] }))
    }
    if (type === 'Pricing Table' && site.menuItems?.length) {
      base.title = 'Our Menu'
      base.plans = site.menuItems.slice(0, 6).map(item => ({ name: item.name, price: item.price }))
    }
    if (type === 'Photo Gallery') {
      base.images = [0, 1, 2, 3].map(j => generateImageUrl(`${site.imagePrompt || site.businessName || 'business'}, photo ${j + 1}, professional`, 400, 400))
    }
    if (type === 'Testimonials' && base.items) {
      base.items = base.items.map(t => ({ ...t, photo: generateImageUrl('professional headshot portrait, friendly smile', 100, 100) }))
    }
    if (type === 'Team Section' && base.members) {
      base.members = base.members.map(m => ({ ...m, photo: generateImageUrl('professional headshot portrait, business attire', 100, 100) }))
    }
    if (type === 'Footer') {
      base.text = `© 2026 ${site.businessName || 'Your Business'}. All rights reserved.`
    }

    return { uid: `block-${Date.now()}-${i}`, type, data: base }
  })
}
