import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Menu, X, MoveUpRight, Rotate3D, Plus, Minus } from 'lucide-react'
const Valve3D = lazy(() => import('./Valve3D'))
const Model = props => <Suspense fallback={<div className="model-loading">Preparing 3D view…</div>}><Valve3D {...props} /></Suspense>
const clamp = v => Math.max(0, Math.min(1, v))
function useProgress(ref) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let frame
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!ref.current) return
        setValue(clamp(-ref.current.getBoundingClientRect().top / Math.max(1, ref.current.offsetHeight - innerHeight)))
      })
    }
    update(); addEventListener('scroll', update, { passive: true }); addEventListener('resize', update)
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', update); removeEventListener('resize', update) }
  }, [ref])
  return value
}
function Brand() { return <a href="#top" className="brand" aria-label="VBG Intech home"><b>VBG</b><span>intech.</span></a> }
function Navbar() {
  const [open, setOpen] = useState(false)
  return <header className="nav-wrap"><nav className="shell nav"><Brand /><div className={'nav-links ' + (open ? 'is-open' : '')}>{[['#3d','Engineering'],['#globe','Inside the valve'],['#products','Products'],['#drawings','Drawings'],['#capability','Expertise']].map(([href,label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}</div><a href="#contact" className="nav-cta">Let’s talk <ArrowRight size={17} /></a><button className="menu-btn" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></nav></header>
}
function Hero() {
  const ref = useRef(), pointer = useRef({ x: 0, y: 0 })
  const move = event => {
    if (event.pointerType === 'touch') return
    const r = ref.current.getBoundingClientRect()
    const x = event.clientX - r.left, y = event.clientY - r.top
    pointer.current = { x: (x / r.width - .5) * 2, y: (y / r.height - .5) * 2 }
    ref.current.style.setProperty('--mx', x + 'px'); ref.current.style.setProperty('--my', y + 'px')
    ref.current.style.setProperty('--spot-opacity', '1')
  }
  return <section id="top" ref={ref} className="hero" onPointerMove={move} onPointerLeave={() => { pointer.current = { x: 0, y: 0 }; ref.current.style.setProperty('--spot-opacity','0') }}>
    <div className="hero-spot" /><div className="hero-grid" />
    <div className="shell hero-inner"><div className="hero-copy"><div className="eyebrow"><span /> Precision in every movement</div><h1>Control the<br /><em>critical.</em></h1><p>Precision flow control.<br />Engineered for your most demanding applications.</p><div className="hero-actions"><a className="btn primary" href="#3d">Explore the engineering <ArrowDown size={18} /></a><a className="text-link" href="#products">Our valves <ArrowRight size={17} /></a></div><div className="hero-note"><span className="line" /> Built around your process.</div></div>
    <div className="hero-visual"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="model-index">01 / FLOW CONTROL</span><Model pointer={pointer} /><div className="model-caption"><Rotate3D size={18} /><span>Move your cursor. Explore every angle.</span></div></div></div>
    <div className="shell hero-foot"><span>VBG INTECH / ENGINEERING IN MOTION</span><a href="#3d">Scroll to discover <ArrowDown size={16} /></a></div>
  </section>
}
function Engineering() {
  const ref = useRef(), p = useProgress(ref)
  const stages = [
    ['A closer look.','Precision starts with perspective. Explore the geometry of a valve from every side.'],
    ['Every angle matters.','Follow the connections, body and operating mechanism as the assembly turns.'],
    ['Designed as one.','Every element plays its part in a complete flow-control system.']
  ]
  const step = Math.min(2, Math.floor(p * 3)), content = stages[step]
  return <section className="engineering-scroll" id="3d" ref={ref}><div className="engineering-sticky"><div className="shell engineering-grid"><div className="engineering-copy"><div className="eyebrow"><span /> The engineering, revealed</div><div className="section-number">0{step + 1} <span>/ 03</span></div><h2>{content[0]}</h2><p>{content[1]}</p><div className="stage-labels">{['Discover','Rotate','Inspect'].map((label,i) => <span key={label} className={step === i ? 'active' : ''}>{label}</span>)}</div><div className="progress"><i style={{ width: p * 100 + '%' }} /></div><small>SCROLL TO EXPLORE</small></div><div className="engineering-model"><div className="model-topline"><span>VALVE ASSEMBLY</span><Rotate3D size={20} /></div><Model progress={p} /><div className="model-bottomline"><span>360° PERSPECTIVE</span><span>{Math.round(p * 100)} / 100</span></div></div></div></div></section>
}
function Globe() {
  const [open, setOpen] = useState(false)
  return <section id="globe" className="globe-section section-pad"><div className="shell globe-grid"><div className="globe-model"><div className="model-topline"><span>02 / GLOBE VALVE</span><span>CUTAWAY VIEW</span></div><Model kind="globe" progress={open ? 1 : 0} interactive /><div className="model-bottomline"><span>DRAG TO ROTATE</span><Rotate3D size={20} /></div></div><div className="globe-copy"><div className="eyebrow"><span /> Inside the flow</div><h2>The detail<br />makes the<br /><em>difference.</em></h2><p>A cutaway view brings the internal flow path into focus. Discover how the handwheel, stem and disc work together within the valve body.</p><button className="btn primary" onClick={() => setOpen(!open)} aria-pressed={open}>{open ? 'Return to assembly' : 'Separate the components'}{open ? <Minus size={18} /> : <Plus size={18} />}</button><div className="detail-list"><div><span>01</span><strong>Handwheel & stem</strong></div><div><span>02</span><strong>Disc & seating surface</strong></div><div><span>03</span><strong>Pressure-containing body</strong></div></div></div></div></section>
}
const products = [
  ['BG-S','Globe Control Valve','General & severe service','S'],
  ['BG-H','High Pressure Globe Valve','High pressure service','H'],
  ['BG-3','Three Way Globe Valve','Mixing & diverting','3'],
  ['BG-A','Angle Globe Valve','Severe service','A']
]
function Products() {
  return <section id="products" className="products section-pad"><div className="shell"><div className="section-head"><div><div className="eyebrow"><span /> The product platform</div><h2>Find your<br /><em>flow solution.</em></h2></div><p>Different processes. Specific demands.<br />Explore our control valve range.</p></div><div className="product-grid">{products.map(([code,title,service,suffix],i) => <a href={'mailto:info@vbgintech.com?subject=' + encodeURIComponent(code + ' valve enquiry')} className="product-card" key={code}><div className="product-top"><span>0{i + 1}</span><MoveUpRight size={19} /></div><div className="product-image"><img loading="lazy" src={'https://www.vbgintech.com/wp-content/uploads/2018/05/Rev-2-BG-' + suffix + '.jpg'} alt={title} /></div><div className="product-body"><h3>{code}</h3><p>{title}</p><span>{service}</span></div></a>)}</div></div></section>
}
function Drawings() { return <section id="drawings" className="drawings section-pad"><div className="shell"><div className="section-head"><div><div className="eyebrow"><span /> From concept to specification</div><h2>Precision.<br /><em>On every page.</em></h2></div><p>Engineering drawings bring the dimensions,<br />connections and assembly details together.</p></div><div className="drawing-grid"><figure><img loading="lazy" src={new URL('./assets/valve-drawing-globe.png', import.meta.url).href} alt="Globe valve engineering drawing" /><figcaption>01 / GLOBE VALVE ASSEMBLY</figcaption></figure><figure><img loading="lazy" src={new URL('./assets/valve-drawing-butterfly.png', import.meta.url).href} alt="Butterfly valve engineering drawing" /><figcaption>02 / BUTTERFLY VALVE ASSEMBLY</figcaption></figure></div></div></section> }
function Capability() { return <section id="capability" className="capability section-pad"><div className="shell"><div className="eyebrow"><span /> Application-led engineering</div><div className="capability-head"><h2>Confidence.<br />Under pressure.</h2><p>From precise modulation to demanding process conditions, the right valve starts with understanding your application.</p></div><div className="capability-grid">{[['01','Pressure control','Solutions for demanding pressure-drop duties.'],['02','Flow precision','Stable modulation, built around the process.'],['03','Severe service','Engineering for cavitation and noise management.']].map(([n,title,body]) => <div key={n}><span>{n}</span><h3>{title}</h3><p>{body}</p></div>)}</div></div></section> }
function Footer() { return <><section id="contact" className="contact section-pad"><div className="shell contact-inner"><div><div className="eyebrow"><span /> Let’s solve it together</div><h2>Your process.<br /><em>Our expertise.</em></h2></div><a className="contact-link" href="mailto:info@vbgintech.com">Talk to an engineer <ArrowRight size={26} /></a></div></section><footer><div className="shell footer-main"><Brand /><span>Control valves engineered in the UAE.</span><a href="mailto:info@vbgintech.com">info@vbgintech.com</a></div><div className="shell credits">Interactive demonstration models: <a href="https://sketchfab.com/3d-models/valve-in-autodesk-inventor-inventor-tutorial-ceeeb4137ebd40c28c79bb68bd3a1fe8">Valve by cadpractice</a> and <a href="https://sketchfab.com/3d-models/globe-valve-a7ae11b4b59d4360b9274783be4a3c58">Globe Valve by Heber Soto</a>, licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Adapted materials, textures and motion. Demonstration geometry; not VBG product specifications.</div></footer></> }
export default function App() { return <><Navbar /><main><Hero /><Engineering /><Globe /><Products /><Drawings /><Capability /><Footer /></main></> }
