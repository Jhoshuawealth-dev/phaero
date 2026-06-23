import { useState } from 'react'
import EditableText from './EditableText'
import ImageUpload from './ImageUpload'

function AddButton({ onClick, label = '+ Add' }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick() }} style={{ background: 'transparent', border: '1px dashed #333', color: '#555', padding: '8px 14px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', marginTop: '8px' }}>{label}</button>
  )
}

function RemoveDot({ onClick }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick() }} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ff4444', border: 'none', color: '#fff', width: '18px', height: '18px', borderRadius: '50%', cursor: 'pointer', fontSize: '10px', lineHeight: '18px', opacity: 0 }} className="item-remove">✕</button>
  )
}

export default function BlockRenderer({ type, data, onUpdate }) {
  const update = (field, value) => onUpdate({ ...data, [field]: value })

  switch (type) {
    case 'Hero Banner':
      return (
        <div style={{ background: data.image ? '#000' : data.bgColor, padding: '40px 24px', textAlign: 'center', position: 'relative', backgroundImage: data.image ? `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${data.image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div style={{ position: 'absolute', top: '8px', right: '8px', width: '36px', height: '36px' }} onClick={e => e.stopPropagation()}>
            <ImageUpload value={null} onChange={(url) => update('image', url)} height="36px" label="" />
          </div>
          <EditableText value={data.title} onChange={(v) => update('title', v)} tag="h1" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '32px', fontWeight: '800', color: '#D4AF37', marginBottom: '8px', lineHeight: '1.2' }} />
          <EditableText value={data.subtitle} onChange={(v) => update('subtitle', v)} tag="div" style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(255,255,255,0.75)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }} />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <EditableText value={data.btnText} onChange={(v) => update('btnText', v)} tag="div" style={{ background: '#D4AF37', borderRadius: '6px', padding: '10px 20px', fontSize: '13px', color: '#000', fontWeight: '700' }} />
            <div style={{ background: '#25D366', borderRadius: '6px', padding: '10px 20px', fontSize: '13px', color: '#fff', fontWeight: '700' }}>💬 WhatsApp</div>
          </div>
        </div>
      )

    case 'About Section':
      return (
        <div style={{ padding: '32px 24px', background: data.bgColor }}>
          <EditableText value={data.title} onChange={(v) => update('title', v)} tag="div" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '12px', lineHeight: '1.3' }} />
          <EditableText value={data.body} onChange={(v) => update('body', v)} tag="p" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#999', lineHeight: '1.7' }} />
        </div>
      )

    case 'Services':
      return (
        <div style={{ padding: '24px', background: data.bgColor }}>
          <EditableText value={data.title} onChange={(v) => update('title', v)} tag="div" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '14px', lineHeight: '1.3' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {(data.items || []).map((item, i) => (
              <div key={i} style={{ position: 'relative', height: '90px', background: item.color, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="item-hover">
                <RemoveDot onClick={() => update('items', data.items.filter((_, idx) => idx !== i))} />
                <EditableText value={item.name} onChange={(v) => { const items = [...data.items]; items[i] = { ...item, name: v }; update('items', items) }} tag="div" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px' }} />
              </div>
            ))}
          </div>
          <AddButton label="+ Add service" onClick={() => update('items', [...(data.items || []), { name: 'New Service', color: '#3a1a3a' }])} />
        </div>
      )

    case 'Pricing Table':
      return (
        <div style={{ padding: '24px', background: data.bgColor }}>
          <EditableText value={data.title} onChange={(v) => update('title', v)} tag="div" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '18px', textAlign: 'center', lineHeight: '1.3' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {(data.plans || []).map((plan, i) => (
              <div key={i} style={{ position: 'relative', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '16px', textAlign: 'center' }} className="item-hover">
                <RemoveDot onClick={() => update('plans', data.plans.filter((_, idx) => idx !== i))} />
                <EditableText value={plan.name} onChange={(v) => { const plans = [...data.plans]; plans[i] = { ...plan, name: v }; update('plans', plans) }} tag="div" style={{ fontSize: '12px', color: '#D4AF37', fontWeight: '700', marginBottom: '6px' }} />
                <EditableText value={`₦${plan.price}`} onChange={(v) => { const num = parseInt(v.replace(/[^\d]/g, '')) || 0; const plans = [...data.plans]; plans[i] = { ...plan, price: num }; update('plans', plans) }} tag="div" style={{ fontSize: '18px', color: '#fff', fontWeight: '800' }} />
              </div>
            ))}
          </div>
          <AddButton label="+ Add plan" onClick={() => update('plans', [...(data.plans || []), { name: 'New Plan', price: 5000 }])} />
        </div>
      )

    case 'Testimonials':
      return (
        <div style={{ padding: '24px', background: data.bgColor }}>
          <EditableText value={data.title} onChange={(v) => update('title', v)} tag="div" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '14px', lineHeight: '1.3' }} />
          {(data.items || []).map((t, i) => (
            <div key={i} style={{ position: 'relative', background: '#1a1a1a', borderRadius: '8px', padding: '14px', marginBottom: '10px', display: 'flex', gap: '12px', alignItems: 'flex-start' }} className="item-hover">
              <RemoveDot onClick={() => update('items', data.items.filter((_, idx) => idx !== i))} />
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                <ImageUpload value={t.photo} onChange={(url) => { const items = [...data.items]; items[i] = { ...t, photo: url }; update('items', items) }} height="36px" label="" />
              </div>
              <div style={{ flex: 1 }}>
                <EditableText value={t.quote} onChange={(v) => { const items = [...data.items]; items[i] = { ...t, quote: v }; update('items', items) }} tag="p" style={{ fontSize: '13px', color: '#aaa', fontStyle: 'italic', marginBottom: '6px' }} />
                <div style={{ display: 'flex', gap: '6px', fontSize: '12px' }}>
                  <EditableText value={t.name} onChange={(v) => { const items = [...data.items]; items[i] = { ...t, name: v }; update('items', items) }} tag="span" style={{ color: '#D4AF37', fontWeight: '700' }} />
                  <span style={{ color: '#444' }}>·</span>
                  <EditableText value={t.role} onChange={(v) => { const items = [...data.items]; items[i] = { ...t, role: v }; update('items', items) }} tag="span" style={{ color: '#666' }} />
                </div>
              </div>
            </div>
          ))}
          <AddButton label="+ Add testimonial" onClick={() => update('items', [...(data.items || []), { quote: 'New testimonial text', name: 'Customer Name', role: 'Location', photo: null }])} />
        </div>
      )

    case 'Contact Form':
      return (
        <div style={{ padding: '24px', background: data.bgColor }}>
          <EditableText value={data.title} onChange={(v) => update('title', v)} tag="div" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '12px', lineHeight: '1.3' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ background: '#1a1a1a', borderRadius: '6px', padding: '10px', fontSize: '12px', color: '#555' }}>Your name</div>
            <div style={{ background: '#1a1a1a', borderRadius: '6px', padding: '10px', fontSize: '12px', color: '#555' }}>Your message</div>
            <div style={{ background: '#D4AF37', borderRadius: '6px', padding: '10px', fontSize: '12px', color: '#000', fontWeight: '700', textAlign: 'center', width: 'fit-content' }}>Send</div>
          </div>
        </div>
      )

    case 'Photo Gallery':
      return (
        <div style={{ padding: '24px', background: data.bgColor }}>
          <EditableText value={data.title} onChange={(v) => update('title', v)} tag="div" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '14px', lineHeight: '1.3' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {(data.images || []).map((img, i) => (
              <div key={i} style={{ position: 'relative' }} className="item-hover" onClick={e => e.stopPropagation()}>
                {data.images.length > 1 && <RemoveDot onClick={() => update('images', data.images.filter((_, idx) => idx !== i))} />}
                <ImageUpload value={img} onChange={(url) => { const images = [...data.images]; images[i] = url; update('images', images) }} height="70px" label="Upload" />
              </div>
            ))}
          </div>
          <AddButton label="+ Add image slot" onClick={() => update('images', [...(data.images || []), null])} />
        </div>
      )

    case 'Team Section':
      return (
        <div style={{ padding: '24px', background: data.bgColor }}>
          <EditableText value={data.title} onChange={(v) => update('title', v)} tag="div" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '14px', lineHeight: '1.3' }} />
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {(data.members || []).map((m, i) => (
              <div key={i} style={{ position: 'relative', textAlign: 'center', width: '70px' }} className="item-hover" onClick={e => e.stopPropagation()}>
                <RemoveDot onClick={() => update('members', data.members.filter((_, idx) => idx !== i))} />
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 6px', overflow: 'hidden' }}>
                  <ImageUpload value={m.photo} onChange={(url) => { const members = [...data.members]; members[i] = { ...m, photo: url }; update('members', members) }} height="48px" label="" />
                </div>
                <EditableText value={m.name} onChange={(v) => { const members = [...data.members]; members[i] = { ...m, name: v }; update('members', members) }} tag="div" style={{ fontSize: '10px', color: '#888' }} />
              </div>
            ))}
          </div>
          <AddButton label="+ Add member" onClick={() => update('members', [...(data.members || []), { name: 'New Member', photo: null }])} />
        </div>
      )

    case 'FAQ Accordion':
      return (
        <div style={{ padding: '24px', background: data.bgColor }}>
          <EditableText value={data.title} onChange={(v) => update('title', v)} tag="div" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '12px', lineHeight: '1.3' }} />
          {(data.questions || []).map((item, i) => (
            <div key={i} style={{ position: 'relative', padding: '10px 0', borderBottom: '1px solid #222' }} className="item-hover">
              <RemoveDot onClick={() => update('questions', data.questions.filter((_, idx) => idx !== i))} />
              <EditableText value={item.q} onChange={(v) => { const qs = [...data.questions]; qs[i] = { ...item, q: v }; update('questions', qs) }} tag="div" style={{ fontSize: '13px', color: '#ddd', fontWeight: '600', marginBottom: '4px' }} />
              <EditableText value={item.a} onChange={(v) => { const qs = [...data.questions]; qs[i] = { ...item, a: v }; update('questions', qs) }} tag="div" style={{ fontSize: '12px', color: '#666' }} />
            </div>
          ))}
          <AddButton label="+ Add question" onClick={() => update('questions', [...(data.questions || []), { q: 'New question?', a: 'Answer here.' }])} />
        </div>
      )

    case 'WhatsApp CTA':
      return (
        <div style={{ padding: '20px 24px', textAlign: 'center', background: data.bgColor }}>
          <EditableText value={data.text} onChange={(v) => update('text', v)} tag="div" style={{ background: '#25D366', borderRadius: '8px', padding: '12px', color: '#fff', fontWeight: '700', fontSize: '13px', display: 'inline-block' }} />
        </div>
      )

    case 'Paystack Button':
      return (
        <div style={{ padding: '20px 24px', textAlign: 'center', background: data.bgColor }}>
          <EditableText value={data.text} onChange={(v) => update('text', v)} tag="div" style={{ background: '#D4AF37', borderRadius: '8px', padding: '12px', color: '#000', fontWeight: '700', fontSize: '13px', display: 'inline-block' }} />
        </div>
      )

    case 'Footer':
      return (
        <div style={{ padding: '20px 24px', textAlign: 'center', background: data.bgColor, borderTop: '1px solid #1a1a1a' }}>
          <EditableText value={data.text} onChange={(v) => update('text', v)} tag="div" style={{ fontSize: '12px', color: '#444' }} />
        </div>
      )

    default:
      return <div style={{ padding: '20px', color: '#555' }}>Unknown block</div>
  }
}
