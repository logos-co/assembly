<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Testing Evolution Visualization</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState } = React;

    const TestingEvolutionVisuals = () => {
      const [activeEra, setActiveEra] = useState(null);
      const [viewMode, setViewMode] = useState('staircase');

      const eras = [
        {
          id: 1,
          name: 'Sequential',
          period: '1950s-1990s',
          dimensions: ['Single Core', 'Single Machine', 'Single User', 'Trusted'],
          color: '#4ade80',
          failures: ['Logic errors', 'Boundary conditions', 'Edge cases'],
          testing: ['Unit tests', 'TDD', 'Assertions', 'Coverage metrics'],
          tools: ['SUnit/JUnit', 'Design by Contract'],
          assumption: 'Same input → Same output',
          broken_by: 'Thread interleaving makes tests non-reproducible'
        },
        {
          id: 2,
          name: 'Concurrent',
          period: '2000s',
          dimensions: ['Multi Core', 'Single Machine', 'Single User', 'Trusted'],
          color: '#facc15',
          failures: ['Race conditions', 'Deadlocks', 'Memory visibility', 'Heisenbugs'],
          testing: ['Race detection', 'Model checking', 'Systematic scheduling'],
          tools: ['ThreadSanitizer', 'CHESS', 'SPIN', 'Helgrind'],
          assumption: 'All failures are on one machine under your control',
          broken_by: 'Network partitions and partial failures across machines'
        },
        {
          id: 3,
          name: 'Distributed',
          period: '2010s',
          dimensions: ['Multi Core', 'Multi Machine', 'Single User', 'Trusted'],
          color: '#f97316',
          failures: ['Network partitions', 'Partial failures', 'Split brain', 'Message loss'],
          testing: ['Chaos engineering', 'Partition injection', 'Consistency verification'],
          tools: ['Chaos Monkey', 'Jepsen', 'QuickCheck', 'Distributed tracing'],
          assumption: 'Failures are accidental, not intentional',
          broken_by: 'Resource contention and tenant isolation requirements'
        },
        {
          id: 4,
          name: 'Multi-tenant',
          period: '2015s',
          dimensions: ['Multi Core', 'Multi Machine', 'Multi User', 'Trusted'],
          color: '#ec4899',
          failures: ['Noisy neighbors', 'Isolation breaches', 'SLA violations', 'Cascade failures'],
          testing: ['Load testing', 'Contract testing', 'Canary deployments'],
          tools: ['k6', 'Pact', 'Synthetic monitoring', 'Error budgets'],
          assumption: "Users may compete for resources but won't attack",
          broken_by: 'Economic incentives to exploit vulnerabilities'
        },
        {
          id: 5,
          name: 'Adversarial',
          period: '2020s',
          dimensions: ['Multi Core', 'Multi Machine', 'Multi User', 'Untrusted'],
          color: '#8b5cf6',
          failures: ['Byzantine faults', 'Reentrancy', 'MEV extraction', 'Sybil attacks', 'Economic exploits'],
          testing: ['Formal verification', 'Property-based fuzzing', 'Deterministic simulation'],
          tools: ['TLA+', 'Certora', 'Echidna', 'Antithesis', 'Bug bounties'],
          assumption: 'Must prove correctness, not just test it',
          broken_by: '—'
        }
      ];

      const StaircaseView = () => (
        <div className="relative">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Cumulative Complexity Model</h3>
            <p className="text-sm text-gray-500">Each era inherits all previous failure modes</p>
          </div>
          <div className="flex items-end justify-center gap-2 h-96">
            {eras.map((era, idx) => (
              <div
                key={era.id}
                className="relative cursor-pointer transition-all duration-300 hover:opacity-90 hover:scale-105"
                style={{ 
                  width: '140px',
                  height: `${(idx + 1) * 70}px`,
                  backgroundColor: era.color,
                  borderRadius: '6px 6px 0 0',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                onClick={() => setActiveEra(activeEra === era.id ? null : era.id)}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-start pt-3 text-white text-center px-2">
                  <span className="font-bold text-base">{era.name}</span>
                  <span className="text-xs opacity-80">{era.period}</span>
                  {idx > 0 && (
                    <span className="text-xs mt-1 px-2 py-0.5 bg-white/20 rounded">
                      + {era.dimensions[idx < 4 ? idx : 3]}
                    </span>
                  )}
                </div>
                {idx > 0 && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 opacity-20"
                    style={{ 
                      height: `${idx * 70}px`,
                      background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 69px, transparent 69px, transparent 70px)'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );

      const MatrixView = () => {
        const dimensions = ['Cores', 'Machines', 'Users', 'Trust Model'];
        const dimValues = [
          ['Single', 'Multi', 'Multi', 'Multi', 'Multi'],
          ['Single', 'Single', 'Multi', 'Multi', 'Multi'],
          ['Single', 'Single', 'Single', 'Multi', 'Multi'],
          ['Trusted', 'Trusted', 'Trusted', 'Trusted', 'Untrusted']
        ];
        
        return (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-700">Complexity Dimension Matrix</h3>
              <p className="text-sm text-gray-500">Each column adds one complexity dimension</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 text-left text-sm font-medium text-gray-600 border-b-2"></th>
                    {eras.map(era => (
                      <th 
                        key={era.id} 
                        className="p-3 text-center text-sm font-bold border-b-2 cursor-pointer hover:bg-gray-50"
                        style={{ color: era.color, borderBottomColor: era.color }}
                        onClick={() => setActiveEra(activeEra === era.id ? null : era.id)}
                      >
                        {era.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dimensions.map((dim, dimIdx) => (
                    <tr key={dim} className="border-b">
                      <td className="p-3 text-sm font-medium text-gray-600">{dim}</td>
                      {eras.map((era, eraIdx) => {
                        const isNewInThisEra = (dimIdx === 0 && eraIdx === 1) ||
                                              (dimIdx === 1 && eraIdx === 2) ||
                                              (dimIdx === 2 && eraIdx === 3) ||
                                              (dimIdx === 3 && eraIdx === 4);
                        const value = dimValues[dimIdx][eraIdx];
                        return (
                          <td 
                            key={`${dim}-${era.id}`} 
                            className={`p-3 text-center text-sm transition-all ${isNewInThisEra ? 'font-bold scale-110' : ''}`}
                            style={{ 
                              backgroundColor: isNewInThisEra ? `${era.color}40` : 'transparent',
                              color: isNewInThisEra ? era.color : '#666'
                            }}
                          >
                            {value}
                            {isNewInThisEra && <span className="ml-1">★</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      };

      const TimelineView = () => (
        <div>
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Breaking Point Timeline</h3>
            <p className="text-sm text-gray-500">What each era's testing can't handle</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2" />
            
            {eras.map((era, idx) => (
              <div 
                key={era.id}
                className={`relative flex items-center mb-8 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`w-5/12 ${idx % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div 
                    className="p-4 rounded-lg shadow-md border-l-4 bg-white cursor-pointer hover:shadow-lg transition-all hover:scale-102"
                    style={{ borderLeftColor: era.color }}
                    onClick={() => setActiveEra(activeEra === era.id ? null : era.id)}
                  >
                    <div className="font-bold text-lg" style={{ color: era.color }}>{era.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{era.period}</div>
                    <div className="text-sm text-gray-700 mb-2">
                      <strong>Tests for:</strong> {era.failures.slice(0, 2).join(', ')}
                    </div>
                    {era.broken_by !== '—' && (
                      <div className="text-sm text-red-600 italic mt-2 p-2 bg-red-50 rounded">
                        ⚠️ {era.broken_by}
                      </div>
                    )}
                  </div>
                </div>
                
                <div 
                  className="absolute left-1/2 w-8 h-8 rounded-full border-4 border-white transform -translate-x-1/2 z-10 flex items-center justify-center text-white font-bold text-sm shadow-md"
                  style={{ backgroundColor: era.color }}
                >
                  {era.id}
                </div>
                
                <div className="w-5/12" />
              </div>
            ))}
          </div>
        </div>
      );

      const ToolsView = () => (
        <div>
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Testing Tools Evolution</h3>
            <p className="text-sm text-gray-500">Key tools that defined each era</p>
          </div>
          <div className="space-y-4">
            {eras.map(era => (
              <div 
                key={era.id}
                className="flex items-stretch rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all hover:scale-101"
                onClick={() => setActiveEra(activeEra === era.id ? null : era.id)}
              >
                <div 
                  className="w-36 p-4 flex flex-col justify-center text-white"
                  style={{ backgroundColor: era.color }}
                >
                  <div className="font-bold text-lg">{era.name}</div>
                  <div className="text-xs opacity-80">{era.period}</div>
                </div>
                <div className="flex-1 p-4 bg-white">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {era.tools.map(tool => (
                      <span 
                        key={tool}
                        className="px-3 py-1 text-sm rounded-full font-medium"
                        style={{ backgroundColor: `${era.color}25`, color: era.color }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {era.testing.join(' • ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      const DetailPanel = () => {
        const era = eras.find(e => e.id === activeEra);
        if (!era) return null;
        
        return (
          <div 
            className="mt-6 p-5 rounded-xl border-2 shadow-inner"
            style={{ borderColor: era.color, backgroundColor: `${era.color}08` }}
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-xl" style={{ color: era.color }}>
                Era {era.id}: {era.name} Systems
              </h4>
              <button 
                onClick={() => setActiveEra(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-5 text-sm">
              <div>
                <div className="font-semibold text-gray-700 mb-2">Environment</div>
                <div className="flex flex-wrap gap-2">
                  {era.dimensions.map(d => (
                    <span key={d} className="px-3 py-1 bg-white rounded-full text-gray-600 text-xs shadow-sm">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="font-semibold text-gray-700 mb-2">Core Assumption</div>
                <div className="text-gray-600 italic bg-white p-2 rounded">"{era.assumption}"</div>
              </div>
              
              <div>
                <div className="font-semibold text-gray-700 mb-2">New Failure Modes</div>
                <ul className="text-gray-600 space-y-1">
                  {era.failures.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: era.color }}></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="font-semibold text-gray-700 mb-2">Testing Innovations</div>
                <ul className="text-gray-600 space-y-1">
                  {era.testing.map(t => (
                    <li key={t} className="flex items-center gap-2">
                      <span style={{ color: era.color }}>✓</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {era.broken_by !== '—' && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="text-red-600 font-semibold">Breaking point → </span>
                <span className="text-red-700">{era.broken_by}</span>
            >  </div>
            )}
          </div>
        );
      };

      return (
        <div className="max-w-5xl mx-auto p-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Evolution of Testing Methodologies
            </h1>
            <p className="text-gray-600 text-lg">
              From Deterministic to Adversarial Systems
            </p>
          </div>
          
          <div className="flex justify-center gap-3 mb-10">
            {[
              { id: 'staircase', label: '📊 Staircase', desc: 'Cumulative view' },
              { id: 'matrix', label: '📋 Matrix', desc: 'Dimensions' },
              { id: 'timeline', label: '⏱️ Timeline', desc: 'Breaking points' },
              { id: 'tools', label: '🛠️ Tools', desc: 'By era' }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setViewMode(view.id)}
                className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                  viewMode === view.id 
                    ? 'bg-gray-800 text-white shadow-lg scale-105' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
                }`}
              >
                <div>{view.label}</div>
                <div className="text-xs opacity-70">{view.desc}</div>
              </button>
            ))}
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {viewMode === 'staircase' && <StaircaseView />}
            {viewMode === 'matrix' && <MatrixView />}
            {viewMode === 'timeline' && <TimelineView />}
            {viewMode === 'tools' && <ToolsView />}
            
            <DetailPanel />
          </div>
          
          <div className="mt-8 flex justify-center gap-6 flex-wrap">
            {eras.map(era => (
              <div key={era.id} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full shadow-sm" 
                  style={{ backgroundColor: era.color }}
                />
                <span className="text-sm text-gray-600 font-medium">{era.name}</span>
              </div>
            ))}
          </div>
          
          <p className="text-center text-sm text-gray-400 mt-6">
            Click any era for detailed breakdown
          </p>
        </div>
      );
    };

    ReactDOM.render(<TestingEvolutionVisuals />, document.getElementById('root'));
  </script>
</body>
</html>
