import { useState, useEffect } from 'react'
import { Bar, Pie, Line, Doughnut, Radar, PolarArea, Bubble } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement, TimeScale, Tooltip, Legend, RadialLinearScale, PolarAreaController, RadarController } from 'chart.js'
import 'chartjs-adapter-date-fns'
Chart.register(BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement, TimeScale, Tooltip, Legend, RadialLinearScale, PolarAreaController, RadarController)

const chartTypes = [
  { key: 'main', label: 'Dashboard', icon: '📊' },
  { key: 'bar', label: 'Bar Chart', icon: '📈' },
  { key: 'stackedBar', label: 'Stacked Bar', icon: '📊' },
  { key: 'pie', label: 'Pie Chart', icon: '🥧' },
  { key: 'doughnut', label: 'Doughnut', icon: '🍩' },
  { key: 'polar', label: 'Polar Area', icon: '🎯' },
  { key: 'bubble', label: 'Bubble Chart', icon: '🫧' }
]

export default function ChartView({ articles }) {
  const [selected, setSelected] = useState('main')
  // Detect theme
  useEffect(() => {
    const root = window.document.documentElement
    setIsDark(root.classList.contains('dark'))
  }, [])
  const [isDark, setIsDark] = useState(false)

  // Bar & Doughnut: Articles by author
  const authorCounts = articles.reduce((acc, a) => {
    const author = a.author || 'Unknown'
    acc[author] = (acc[author] || 0) + 1
    return acc
  }, {})

  // Helper to truncate labels
  function truncateLabel(label, max = 10) {
    return label.length > max ? label.slice(0, max) + '…' : label;
  }

  // Color palette for bars
  const palette = [
    '#60a5fa', '#f87171', '#34d399', '#fbbf24', '#a78bfa', '#f472b6', '#38bdf8', '#facc15', '#4ade80', '#fb7185', '#818cf8', '#f59e42', '#2dd4bf', '#c084fc', '#fcd34d', '#fca5a5', '#a3e635', '#fda4af', '#f472b6', '#fbbf24'
  ];

  // For bar and line charts, use truncated labels and colorful bars
  const barData = {
    labels: Object.keys(authorCounts).map(l => truncateLabel(l)),
    datasets: [{
      label: 'Articles by Author',
      data: Object.values(authorCounts),
      backgroundColor: Object.keys(authorCounts).map((_, i) => palette[i % palette.length]),
      borderColor: Object.keys(authorCounts).map((_, i) => palette[i % palette.length]),
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  }
  const doughnutData = {
    labels: Object.keys(authorCounts),
    datasets: [{
      label: 'Articles by Author',
      data: Object.values(authorCounts),
      backgroundColor: [
        'rgba(75,192,192,0.8)',
        'rgba(255,99,132,0.8)',
        'rgba(255,205,86,0.8)',
        'rgba(54,162,235,0.8)',
        'rgba(153,102,255,0.8)',
        'rgba(201,203,207,0.8)'
      ],
      borderColor: [
        'rgba(75,192,192,1)',
        'rgba(255,99,132,1)',
        'rgba(255,205,86,1)',
        'rgba(54,162,235,1)',
        'rgba(153,102,255,1)',
        'rgba(201,203,207,1)'
      ],
      borderWidth: 2,
    }]
  }

  // Pie: Articles by source
  const sourceCounts = articles.reduce((acc, a) => {
    const source = (a.source && a.source.name) || 'Unknown'
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {})
  const pieData = {
    labels: Object.keys(sourceCounts),
    datasets: [{
      label: 'Articles by Source',
      data: Object.values(sourceCounts),
      backgroundColor: [
        'rgba(75,192,192,0.6)',
        'rgba(255,99,132,0.6)',
        'rgba(255,205,86,0.6)',
        'rgba(54,162,235,0.6)',
        'rgba(153,102,255,0.6)',
        'rgba(201,203,207,0.6)'
      ],
      borderColor: [
        'rgba(75,192,192,1)',
        'rgba(255,99,132,1)',
        'rgba(255,205,86,1)',
        'rgba(54,162,235,1)',
        'rgba(153,102,255,1)',
        'rgba(201,203,207,1)'
      ],
      borderWidth: 2,
    }]
  }

  // Line: Articles per source per day
  const sourceDateCounts = {};
  articles.forEach(a => {
    const date = a.publishedAt ? a.publishedAt.slice(0, 10) : 'Unknown';
    const source = (a.source && a.source.name) || 'Unknown';
    if (!sourceDateCounts[source]) sourceDateCounts[source] = {};
    sourceDateCounts[source][date] = (sourceDateCounts[source][date] || 0) + 1;
  });
  const allDates = Array.from(new Set(articles.map(a => a.publishedAt ? a.publishedAt.slice(0, 10) : 'Unknown'))).sort();
  const lineDatasets = Object.keys(sourceDateCounts).map((source, i) => ({
    label: truncateLabel(source, 14),
    data: allDates.map(date => sourceDateCounts[source][date] || 0),
    borderColor: palette[i % palette.length],
    backgroundColor: palette[i % palette.length],
    tension: 0.4,
    fill: false,
    borderWidth: 3,
    pointRadius: 4,
    pointHoverRadius: 6,
  }));
  const lineData = {
    labels: allDates,
    datasets: lineDatasets.length > 0 ? lineDatasets : [{
      label: 'Articles per Day',
      data: allDates.map(date => sourceDateCounts[date] || 0),
      fill: false,
      borderColor: 'rgba(54,162,235,1)',
      backgroundColor: 'rgba(54,162,235,0.2)',
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  };

  // Radar: Articles by author (or source)
  const radarData = {
    labels: Object.keys(authorCounts),
    datasets: [{
      label: 'Articles by Author',
      data: Object.values(authorCounts),
      backgroundColor: 'rgba(54,162,235,0.2)',
      borderColor: 'rgba(54,162,235,1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(255,99,132,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255,99,132,1)'
    }]
  }
  // Polar Area: Articles by source
  const polarData = {
    labels: Object.keys(sourceCounts),
    datasets: [{
      label: 'Articles by Source',
      data: Object.values(sourceCounts),
      backgroundColor: [
        'rgba(75,192,192,0.6)',
        'rgba(255,99,132,0.6)',
        'rgba(255,205,86,0.6)',
        'rgba(54,162,235,0.6)',
        'rgba(153,102,255,0.6)',
        'rgba(201,203,207,0.6)'
      ],
      borderColor: [
        'rgba(75,192,192,1)',
        'rgba(255,99,132,1)',
        'rgba(255,205,86,1)',
        'rgba(54,162,235,1)',
        'rgba(153,102,255,1)',
        'rgba(201,203,207,1)'
      ],
      borderWidth: 2,
    }]
  }

  // Bubble: Articles by author (x=index, y=count, r=scaled count)
  const bubbleData = {
    datasets: [
      {
        label: 'Articles by Author',
        data: Object.keys(authorCounts).map((author, i) => ({
          x: i + 1,
          y: authorCounts[author],
          r: Math.max(8, Math.min(30, authorCounts[author] * 8)),
          author: truncateLabel(author)
        })),
        backgroundColor: Object.keys(authorCounts).map((_, i) => palette[i % palette.length]),
        borderColor: Object.keys(authorCounts).map((_, i) => palette[i % palette.length]),
        borderWidth: 2,
      }
    ]
  }
  // Bubble chart options for standalone chart (show axis labels/ticks)
  const bubbleStandaloneOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => {
            const d = ctx.raw
            return `${d.author}: ${d.y} articles`
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: true },
        ticks: {
          display: true,
          callback: (val, idx) => Object.keys(authorCounts)[idx] ? truncateLabel(Object.keys(authorCounts)[idx]) : '',
          font: { size: 10 },
          maxRotation: 35,
          minRotation: 25,
          autoSkip: false,
          padding: 8
        },
        title: { display: false },
        min: 0,
        max: Object.keys(authorCounts).length + 1
      },
      y: {
        grid: { display: true },
        ticks: { display: true },
        title: { display: false },
        beginAtZero: true
      }
    }
  }

  // Chart area background plugin
  const chartBgPlugin = {
    id: 'customBg',
    beforeDraw: (chart) => {
      const ctx = chart.ctx
      ctx.save()
      ctx.globalCompositeOperation = 'destination-over'
      ctx.fillStyle = isDark ? '#1f2937' : '#fff'
      ctx.fillRect(0, 0, chart.width, chart.height)
      ctx.restore()
    }
  }

  // Chart options with tooltips and truncated ticks
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: { 
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: (items) => {
            // Show full label in tooltip
            const idx = items[0].dataIndex;
            if (selected === 'bar' || selected === 'radar') return Object.keys(authorCounts)[idx];
            if (selected === 'pie' || selected === 'doughnut' || selected === 'polar') return Object.keys(sourceCounts)[idx];
            if (selected === 'line') return allDates[idx];
            return '';
          }
        },
        customBg: chartBgPlugin,
      }
    },
    scales: (selected === 'bar' || selected === 'line') ? {
      x: {
        grid: {
          color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          drawBorder: false
        },
        ticks: {
          callback: function(val) {
            return this.getLabelForValue(val);
          },
          font: { size: 10 },
          maxRotation: 35,
          minRotation: 25,
          autoSkip: false,
          padding: 8,
          color: isDark ? '#9ca3af' : '#6b7280'
        }
      },
      y: {
        grid: {
          color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          drawBorder: false
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280'
        },
        beginAtZero: true
      }
    } : undefined
  }

  // Pie chart options (no labels)
  const pieNoLabelOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: { display: false },
      tooltip: { 
        enabled: true,
        backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
      },
      customBg: chartBgPlugin,
    }
  }
  // Doughnut chart options (no labels)
  const doughnutNoLabelOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: { display: false },
      tooltip: { 
        enabled: true,
        backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
      },
      customBg: chartBgPlugin,
    }
  }

  // Stacked Bar: Articles by author and by source
  const stackedBarData = {
    labels: Object.keys(authorCounts).map(l => truncateLabel(l)),
    datasets: [
      {
        label: 'By Author',
        data: Object.values(authorCounts),
        backgroundColor: palette[0],
        borderColor: palette[0],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'By Source',
        data: Object.keys(authorCounts).map((_, i) => Object.values(sourceCounts)[i % Object.values(sourceCounts).length] || 0),
        backgroundColor: palette[1],
        borderColor: palette[1],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  }
  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: { 
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: { 
        enabled: true,
        backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
      },
      customBg: chartBgPlugin,
    },
    scales: {
      x: { 
        stacked: true,
        grid: {
          color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          drawBorder: false
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280'
        }
      },
      y: { 
        stacked: true, 
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          drawBorder: false
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280'
        }
      }
    }
  }

  let chart = null
  if (selected === 'main') {
    chart = (
      <div className="flex flex-row gap-6 w-full h-[420px] items-center justify-center">
        {/* Left: Bar chart */}
        <div className="flex-1 h-72 flex items-center justify-center min-w-[200px] bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
          <Bar data={barData} options={chartOptions} height={288} />
        </div>
        {/* Right: Pie above, Bubble below */}
        <div className="flex flex-col gap-6 justify-center items-center w-1/3 min-w-[200px]">
          <div className="w-full h-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
            <Pie data={pieData} options={pieNoLabelOptions} height={160} />
          </div>
          <div className="w-full h-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
            <Bubble data={bubbleData} options={bubbleStandaloneOptions} height={160} />
          </div>
        </div>
      </div>
    )
  } else if (selected === 'bar') {
    chart = (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <Bar data={barData} options={chartOptions} height={400} />
      </div>
    )
  } else if (selected === 'pie') {
    chart = (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <Pie data={pieData} options={pieNoLabelOptions} height={400} />
      </div>
    )
  } else if (selected === 'line') {
    chart = (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <Line data={lineData} options={chartOptions} height={400} />
      </div>
    )
  } else if (selected === 'doughnut') {
    chart = (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <Doughnut data={doughnutData} options={doughnutNoLabelOptions} height={400} />
      </div>
    )
  } else if (selected === 'polar') {
    chart = (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <PolarArea data={polarData} options={chartOptions} height={400} />
      </div>
    )
  } else if (selected === 'bubble') {
    chart = (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <Bubble data={bubbleData} options={bubbleStandaloneOptions} height={400} />
      </div>
    )
  } else if (selected === 'stackedBar') {
    chart = (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <Bar data={stackedBarData} options={stackedBarOptions} height={400} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="h-[420px]">{chart}</div>
      <div className="flex justify-center gap-3 mt-4 flex-wrap">
        {chartTypes.map(type => (
          <button
            key={type.key}
            onClick={() => setSelected(type.key)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 border-2 ${
              selected === type.key 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500 shadow-lg transform scale-105' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
            }`}
          >
            <span className="mr-2">{type.icon}</span>
            {type.label}
          </button>
        ))}
      </div>
    </div>
  )
} 