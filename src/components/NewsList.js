import { useEffect, useState } from 'react'
import axios from 'axios'
import ChartView from './ChartView'
import jsPDF from 'jspdf'
import Papa from 'papaparse'
import { useSession } from 'next-auth/react'

export default function NewsList() {
  const [articles, setArticles] = useState([])
  const [filters, setFilters] = useState({ author: '', dateFrom: '', dateTo: '', type: '', keyword: '' })
  const [filtered, setFiltered] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  // Payout state
  const [payoutRates, setPayoutRates] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('payoutRates') || '{}')
    }
    return {}
  })

  // Get unique authors and sources from filtered articles
  const uniqueAuthors = Array.from(new Set(articles.map(a => a.author || 'Unknown'))).sort();
  const uniqueSources = Array.from(new Set(articles.map(a => (a.source && a.source.name) || 'Unknown'))).sort();

  useEffect(() => {
    setLoading(true)
    axios.get('/api/news')
      .then(res => setArticles(res.data.articles))
      .catch(() => setError('Failed to fetch news. Please try again later.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let data = articles
    if (filters.author) data = data.filter(a => (a.author || '').toLowerCase().includes(filters.author.toLowerCase()))
    if (filters.dateFrom) data = data.filter(a => a.publishedAt && a.publishedAt >= filters.dateFrom)
    if (filters.dateTo) data = data.filter(a => a.publishedAt && a.publishedAt <= filters.dateTo)
    if (filters.type) data = data.filter(a => (a.source && a.source.name && a.source.name.toLowerCase().includes(filters.type.toLowerCase())))
    if (filters.keyword) data = data.filter(a => (a.title + a.description + a.content).toLowerCase().includes(filters.keyword.toLowerCase()))
    setFiltered(data)
  }, [articles, filters])

  // Save payout rates to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('payoutRates', JSON.stringify(payoutRates))
    }
  }, [payoutRates])

  // Payout table data
  const authorCounts = filtered.reduce((acc, a) => {
    const author = a.author || 'Unknown'
    acc[author] = (acc[author] || 0) + 1
    return acc
  }, {})
  const payoutRows = Object.keys(authorCounts).map(author => ({
    author,
    count: authorCounts[author],
    rate: payoutRates[author] || 0,
    total: (payoutRates[author] || 0) * authorCounts[author]
  }))
  const totalPayout = payoutRows.reduce((sum, row) => sum + row.total, 0)

  function handleRateChange(author, value) {
    setPayoutRates(rates => ({ ...rates, [author]: Number(value) }))
  }

  function exportPayoutCSV() {
    const csv = Papa.unparse([
      ['Author', 'Articles', 'Payout Rate', 'Total Payout'],
      ...payoutRows.map(r => [r.author, r.count, r.rate, r.total]),
      ['', '', 'Total', totalPayout]
    ])
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'payouts.csv'
    link.click()
  }

  function exportPayoutPDF() {
    const doc = new jsPDF()
    doc.text('Payout Report', 10, 10)
    payoutRows.forEach((r, i) => {
      doc.text(`${r.author} | ${r.count} | ${r.rate} | ${r.total}`, 10, 20 + i * 10)
    })
    doc.text(`Total: ${totalPayout}`, 10, 30 + payoutRows.length * 10)
    doc.save('payouts.pdf')
  }

  function exportPayoutGoogleSheets() {
    alert('Google Sheets export is a placeholder. Implement API integration as needed.')
  }

  // Admin check (hardcoded email)
  const isAdmin = session && session.user && session.user.email === 'admin@example.com'

  function exportPDF() {
    const doc = new jsPDF()
    filtered.forEach((a, i) => {
      doc.text(`${i + 1}. ${a.title}`, 10, 10 + i * 10)
    })
    doc.save('report.pdf')
  }

  function exportCSV() {
    const csv = Papa.unparse(filtered)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'report.csv'
    link.click()
  }

  // Loading component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300">Loading news dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-4">
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📰 News Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Stay informed with the latest news and insights
          </p>
        </div>

        {/* Charts Section */}
        <div className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              📊 Analytics Overview
            </h2>
            <ChartView articles={filtered} />
          </div>
        </div>

        {/* Filter/Search Bar */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              🔍 Search & Filter
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  👤 Author
                </label>
                <select 
                  value={filters.author} 
                  onChange={e => setFilters(f => ({ ...f, author: e.target.value }))} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Authors</option>
                  {uniqueAuthors.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  📅 From Date
                </label>
                <input 
                  type="date" 
                  value={filters.dateFrom} 
                  onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  📅 To Date
                </label>
                <input 
                  type="date" 
                  value={filters.dateTo} 
                  onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  📰 Source
                </label>
                <select 
                  value={filters.type} 
                  onChange={e => setFilters(f => ({ ...f, type: e.target.value }))} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Sources</option>
                  {uniqueSources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  🔎 Keyword
                </label>
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  value={filters.keyword} 
                  onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Found <span className="font-bold text-blue-600 dark:text-blue-400">{filtered.length}</span> articles
          </p>
        </div>

        {/* News Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.map((article, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white line-clamp-3">
                    {article.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{article.author || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <span>{article.source && article.source.name}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 line-clamp-4">
                  {article.description || 'No description available.'}
                </p>
                
                {article.content && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                    {article.content}
                  </p>
                )}
                
                {article.url && (
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Read Full Article
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Payout Table (admin only) */}
        {isAdmin && (
          <div className="mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              💰 Payout Calculator
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-gray-900 dark:text-white">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Articles</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payout Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Payout</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {payoutRows.map(row => (
                    <tr key={row.author} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{row.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{row.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          value={row.rate}
                          onChange={e => handleRateChange(row.author, e.target.value)}
                          className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">${row.total}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 dark:bg-gray-700 font-bold">
                    <td className="px-6 py-4 text-right" colSpan={3}>Total</td>
                    <td className="px-6 py-4 text-center">${totalPayout}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex gap-4 mt-6 justify-center">
              <button onClick={exportPayoutPDF} className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </button>
              <button onClick={exportPayoutCSV} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
              <button onClick={exportPayoutGoogleSheets} className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Google Sheets
              </button>
            </div>
          </div>
        )}

        {/* Download Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            📥 Export Data
          </h3>
          <div className="flex gap-4 justify-center">
            <button onClick={exportPDF} className="inline-flex items-center px-6 py-3 bg-green-600 text-white text-lg font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
            <button onClick={exportCSV} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 