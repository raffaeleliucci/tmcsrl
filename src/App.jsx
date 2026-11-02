import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard, Wrench, ClipboardList, BarChart3, FileBarChart,
  Settings, Search, CircleHelp, Bell, ChevronDown, Menu, TrainFront,
  MoreHorizontal, CalendarDays, Clock3, CheckCircle2, AlertTriangle,
  Plus, Download, Filter, X, MapPin, Users, Gauge, ArrowUpRight,
  ChevronRight, SlidersHorizontal, LogOut, Truck, FileText
} from 'lucide-react';

const initialJobs = [
  { train:'ETR 500-112', type:'Manutenzione Carrelli', status:'Completato', start:'10/10/2023', due:'02/10/2023', operator:'A. Mazzini', team:'Squadra A' },
  { train:'CN 5990 118-5', type:'Controllo Freni', status:'In Corso', start:'10/10/2023', due:'02/10/2023', operator:'M. Borrelli', team:'Squadra B' },
  { train:'ETR 500-030', type:'Sostituzione Sale', status:'In Pianificazione', start:'10/10/2023', due:'02/10/2023', operator:'G. Russo', team:'Squadra C' },
  { train:'ALn 668-310', type:'Revisione Motore', status:'In Corso', start:'10/10/2023', due:'22/10/2023', operator:'A. Gambardella', team:'Squadra A' },
  { train:'TAF-14', type:'Verifica Impianto Elettrico', status:'Completato', start:'13/10/2023', due:'24/10/2023', operator:'G. Tempestoso', team:'Squadra B' },
  { train:'ETR 500-118', type:'Controllo porte', status:'In Attesa', start:'16/10/2023', due:'28/10/2023', operator:'L. Esposito', team:'Squadra C' },
];
const nav = [
  ['Panoramica', LayoutDashboard], ['Manutenzione', Wrench], ['Flotta', TrainFront],
  ['Report', FileBarChart], ['Impostazioni', Settings]
];
const statusClass = s => s.toLowerCase().replaceAll(' ', '-');

function App() {
  const [page, setPage] = useState('Panoramica');
  const [jobs, setJobs] = useState(initialJobs);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Tutti');
  const [modal, setModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({ train:'', type:'', operator:'', due:'' });
  const filtered = useMemo(() => jobs.filter(j =>
    (filter === 'Tutti' || j.status === filter) &&
    [j.train,j.type,j.operator].join(' ').toLowerCase().includes(query.toLowerCase())
  ), [jobs, filter, query]);

  const notify = msg => { setNotice(msg); window.setTimeout(() => setNotice(''), 2600); };
  const addJob = e => {
    e.preventDefault();
    setJobs([{ ...form, start:new Date().toLocaleDateString('it-IT'), status:'In Pianificazione', team:'Da assegnare' }, ...jobs]);
    setForm({ train:'', type:'', operator:'', due:'' }); setModal(false); setPage('Manutenzione'); notify('Ordine di lavoro creato correttamente');
  };
  const changeStatus = (idx) => {
    const order = ['In Pianificazione','In Corso','Completato'];
    setJobs(prev => prev.map((j,i) => i === idx ? {...j, status:order[(order.indexOf(j.status)+1)%order.length]} : j));
    notify('Stato dell’intervento aggiornato');
  };

  return <div className="app-shell">
    <header className="topbar">
      <button className="icon-button hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Apri menu"><Menu /></button>
      <button className="brand" onClick={() => setPage('Panoramica')}><img src="/tmc-logo.png" alt="TMC SRL Pompei" /></button>
      <nav className="top-nav">{nav.map(([name,Icon]) => <button key={name} className={page===name?'active':''} onClick={()=>setPage(name)}><Icon size={19}/><span>{name}</span></button>)}</nav>
      <div className="top-actions">
        <button className="icon-button" onClick={()=>document.getElementById('global-search')?.focus()} title="Cerca"><Search/></button>
        <button className="icon-button" onClick={()=>notify('Centro assistenza demo')} title="Aiuto"><CircleHelp/></button>
        <button className="icon-button notification" onClick={()=>notify('Non ci sono nuove notifiche')} title="Notifiche"><Bell/><i/></button>
        <button className="profile" onClick={()=>notify('Profilo: Amministratore')}><span className="avatar">AR</span><span>Admin</span><ChevronDown size={15}/></button>
      </div>
    </header>

    <aside className={`sidebar ${sidebarOpen?'open':''}`}>
      <div className="side-menu">{nav.map(([name,Icon])=><button key={name} title={name} className={page===name?'selected':''} onClick={()=>{setPage(name);setSidebarOpen(false)}}><Icon/></button>)}</div>
      <div className="side-bottom"><button onClick={()=>notify('Centro assistenza demo')}><CircleHelp/></button><button onClick={()=>notify('Uscita demo: nessuna sessione reale')}><LogOut/></button></div>
    </aside>

    <main className="main-content">
      <div className="page-heading">
        <div><div className="eyebrow">TMC SRL POMPEI / GESTIONALE</div><h1>{page}</h1><p>{page==='Panoramica'?'Monitoraggio operativo e stato delle attività':page==='Manutenzione'?'Gestione interventi e ordini di lavoro':page==='Flotta'?'Parco rotabili e disponibilità dei mezzi':page==='Report'?'Analisi e indicatori delle performance':'Gestione del sistema e degli utenti'}</p></div>
        <div className="heading-actions"><span className="live"><i/> Sistema operativo</span><button className="primary-btn" onClick={()=>setModal(true)}><Plus size={17}/> Nuovo intervento</button></div>
      </div>

      {page==='Panoramica' && <>
        <section className="metrics">
          <Metric title="Manutenzioni Completate" value="145" detail="Manutenzioni" trend="+12,4%" icon={CheckCircle2} color="green" />
          <Metric title="Treni in Officina" value="12" detail="Attualmente presenti" trend="3 in ingresso" icon={TrainFront} color="blue"/>
          <Metric title="Ordini di Lavoro Aperti" value={jobs.filter(j=>j.status!=='Completato').length+32} detail="Ordini da gestire" trend="5 urgenti" icon={ClipboardList} color="orange"/>
          <div className="metric-card sla-card"><div className="metric-title">Conformità SLA</div><div className="donut"><div><b>97.5%</b><small>Obiettivo 95%</small></div></div></div>
          <div className="metric-card trend-card"><div className="metric-title">Tendenze Manutenzioni <span>(30 Giorni)</span></div><TrendChart/></div>
        </section>
        <JobTable jobs={jobs.slice(0,5)} onStatus={changeStatus} compact />
        <section className="lower-grid">
          <div className="panel"><PanelTitle title="Posizione Treni in Officina"/><div className="map-illustration"><div className="map-grid"></div><span className="pin p1"><TrainFront/></span><span className="pin p2"><Wrench/></span><span className="pin p3"><Wrench/></span><span className="pin p4"><TrainFront/></span><div className="map-label"><MapPin size={14}/> Deposito Pompei</div></div><div className="map-legend"><span><i className="blue-dot"/> In manutenzione</span><span><i className="gray-dot"/> In attesa</span></div></div>
          <div className="panel"><PanelTitle title="Carico Lavoro per Squadra"/><div className="bar-chart">{[['Squadra A',214],['Squadra B',138],['Squadra C',185],['Squadra D',170],['Squadra E',146],['Squadra F',132]].map(([n,v])=><div className="bar-column" key={n}><span>{v}</span><div style={{height:`${v/2.5}%`}}/><small>{n}</small></div>)}</div></div>
        </section>
      </>}

      {page==='Manutenzione' && <section className="panel page-panel"><div className="toolbar"><div className="search-box"><Search size={17}/><input id="global-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cerca treno, intervento, operatore..."/></div><select value={filter} onChange={e=>setFilter(e.target.value)}><option>Tutti</option><option>Completato</option><option>In Corso</option><option>In Pianificazione</option><option>In Attesa</option></select><button className="outline-btn" onClick={()=>notify('Filtri demo applicati')}><Filter size={16}/> Filtri</button><button className="outline-btn" onClick={()=>notify('Esportazione demo pronta')}><Download size={16}/> Esporta</button><button className="primary-btn" onClick={()=>setModal(true)}><Plus size={16}/> Nuovo ordine</button></div><JobTable jobs={filtered} onStatus={changeStatus}/></section>}

      {page==='Flotta' && <section className="fleet-grid">{[['ETR 500-112','Alta Velocità','Disponibile','92%'],['FRECCIAROSSA-45','Alta Velocità','In manutenzione','64%'],['REGIO-230','Regionale','In officina','48%'],['ALn 668-310','Regionale','In manutenzione','71%'],['TAF-14','Metropolitano','Disponibile','88%'],['ETR 500-118','Alta Velocità','In attesa','56%']].map((t,i)=><div className="fleet-card" key={t[0]}><div className="fleet-top"><div className="train-icon"><TrainFront/></div><span className={`fleet-state ${i===1||i===2||i===3?'warn':i===5?'muted':'good'}`}>{t[2]}</span></div><h3>{t[0]}</h3><p>{t[1]} · Matricola {String(2020+i).slice(2)}{String(114+i)}</p><div className="progress-label"><span>Efficienza operativa</span><b>{t[3]}</b></div><div className="progress"><i style={{width:t[3]}}/></div><button className="text-link" onClick={()=>notify(`Scheda ${t[0]} aperta in modalità demo`)}>Apri scheda <ChevronRight size={15}/></button></div>)}</section>}

      {page==='Report' && <><section className="metrics report-metrics"><Metric title="Interventi nel periodo" value="286" detail="Ultimi 30 giorni" trend="+8,2%" icon={Wrench} color="blue"/><Metric title="Tempo medio intervento" value="4,6 h" detail="Tempo di lavorazione" trend="-0,4 h" icon={Clock3} color="green"/><Metric title="Disponibilità flotta" value="94,8%" detail="Media del periodo" trend="+2,1%" icon={Gauge} color="green"/><Metric title="Scadenze imminenti" value="8" detail="Prossimi 7 giorni" trend="Da verificare" icon={CalendarDays} color="orange"/></section><section className="panel report-panel"><PanelTitle title="Andamento interventi mensili"/><div className="report-bars">{[45,62,53,75,68,90,78,96,82,100,88,94].map((v,i)=><div key={i}><span style={{height:`${v}%`}}/><small>{['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'][i]}</small></div>)}</div></section></>}

      {page==='Impostazioni' && <section className="settings-grid"><div className="panel setting-card"><Settings/><h3>Configurazione generale</h3><p>Personalizza le preferenze del gestionale e i parametri aziendali.</p><button className="outline-btn" onClick={()=>notify('Impostazioni generali demo')}>Gestisci impostazioni</button></div><div className="panel setting-card"><Users/><h3>Utenti e permessi</h3><p>Gestisci profili, operatori e livelli di accesso.</p><button className="outline-btn" onClick={()=>notify('Gestione utenti demo')}>Gestisci utenti</button></div><div className="panel setting-card"><SlidersHorizontal/><h3>Squadre operative</h3><p>Organizza le squadre e assegna le attività.</p><button className="outline-btn" onClick={()=>notify('Squadre operative demo')}>Configura squadre</button></div><div className="panel setting-card"><FileText/><h3>Documentazione</h3><p>Consulta procedure e documenti aziendali.</p><button className="outline-btn" onClick={()=>notify('Archivio documenti demo')}>Apri archivio</button></div></section>}
      <footer>© 2026 TMC SRL Pompei <span>Demo dimostrativa · Dati di esempio</span></footer>
    </main>

    {notice && <div className="toast"><CheckCircle2 size={17}/>{notice}</div>}
    {modal && <div className="modal-backdrop" onClick={()=>setModal(false)}><form className="modal" onSubmit={addJob} onClick={e=>e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">GESTIONE MANUTENZIONE</span><h2>Nuovo ordine di lavoro</h2></div><button type="button" className="icon-button" onClick={()=>setModal(false)}><X/></button></div><label>Identificativo treno<input required value={form.train} onChange={e=>setForm({...form,train:e.target.value})} placeholder="Es. ETR 500-120"/></label><label>Tipo di intervento<input required value={form.type} onChange={e=>setForm({...form,type:e.target.value})} placeholder="Es. Controllo impianto frenante"/></label><label>Operatore assegnato<input required value={form.operator} onChange={e=>setForm({...form,operator:e.target.value})} placeholder="Nome operatore"/></label><label>Data scadenza<input required type="date" value={form.due} onChange={e=>setForm({...form,due:e.target.value})}/></label><div className="modal-actions"><button type="button" className="outline-btn" onClick={()=>setModal(false)}>Annulla</button><button className="primary-btn" type="submit"><Plus size={16}/> Crea ordine</button></div></form></div>}
  </div>;
}

function Metric({title,value,detail,trend,icon:Icon,color}) {
  return <div className="metric-card"><div className="metric-top"><span className="metric-title">{title}</span><span className={`metric-icon ${color}`}><Icon size={18}/></span></div><div className="metric-value">{value}</div><div className="metric-foot"><span>{detail}</span><b className={color}>{trend}</b></div></div>;
}
function PanelTitle({title}) { return <div className="panel-title"><h2>{title}</h2><button className="icon-button small" title="Altre opzioni"><MoreHorizontal/></button></div>; }
function TrendChart(){return <svg className="trend-svg" viewBox="0 0 340 104" preserveAspectRatio="none"><path d="M0 82 C28 69 38 31 66 43 S104 65 130 45 S173 33 197 38 S235 4 260 13 S310 22 340 35 L340 104 L0 104Z" fill="#dceaf5"/><path d="M0 82 C28 69 38 31 66 43 S104 65 130 45 S173 33 197 38 S235 4 260 13 S310 22 340 35" fill="none" stroke="#3987b8" strokeWidth="2.5"/><path d="M0 91 C40 80 51 72 77 81 S114 88 139 74 S178 63 203 73 S250 52 275 58 S319 65 340 56 L340 104 L0 104Z" fill="#e9edf1"/><path d="M0 91 C40 80 51 72 77 81 S114 88 139 74 S178 63 203 73 S250 52 275 58 S319 65 340 56" fill="none" stroke="#9aa6b2" strokeWidth="2"/></svg>}
function JobTable({jobs,onStatus,compact=false}) {
 return <section className="panel table-panel"><PanelTitle title={compact?'Attività Recenti':'Ordini di lavoro'}/><div className="table-wrap"><table><thead><tr><th>ID Treno</th><th>Tipo Intervento</th><th>Stato</th><th>Data Inizio</th><th>Scadenza</th><th>Operatore</th><th></th></tr></thead><tbody>{jobs.map((j,i)=><tr key={`${j.train}-${i}`}><td><span className="train-cell"><TrainFront size={20}/>{j.train}</span></td><td><span className="type-cell"><Wrench size={18}/>{j.type}</span></td><td><button className={`status ${statusClass(j.status)}`} onClick={()=>onStatus(i)} title="Clicca per cambiare stato">{j.status}</button></td><td>{j.start}</td><td>{j.due}</td><td><span className="operator"><span className="avatar tiny">{j.operator.split(' ').map(s=>s[0]).join('')}</span>{j.operator}</span></td><td><button className="icon-button small" onClick={()=>onStatus(i)} title="Aggiorna stato"><MoreHorizontal/></button></td></tr>)}</tbody></table>{jobs.length===0&&<div className="empty">Nessun intervento trovato con questi criteri.</div>}</div><div className="table-foot"><span>Visualizzati {jobs.length} interventi</span><span>Demo · Clicca sullo stato per modificarlo</span></div></section>;
}
export default App;
