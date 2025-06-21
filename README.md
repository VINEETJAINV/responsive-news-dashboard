# 📰 News Dashboard

A modern, interactive news dashboard built with Next.js, featuring real-time news data, interactive charts, and advanced filtering capabilities.

![News Dashboard](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.10-38B2AC?style=for-the-badge&logo=tailwind-css)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5.0-FF6384?style=for-the-badge&logo=chart.js)

## ✨ Features

### 📊 Interactive Analytics
- **Multiple Chart Types**: Bar, Pie, Line, Doughnut, Polar Area, Bubble, and Stacked Bar charts
- **Real-time Data Visualization**: Dynamic charts that update based on filtered data
- **Responsive Design**: Charts adapt to different screen sizes
- **Dark/Light Theme Support**: Seamless theme switching for charts and UI

### 🔍 Advanced Filtering
- **Author Filtering**: Filter articles by specific authors
- **Date Range Selection**: Filter by publication date range
- **Source Filtering**: Filter by news sources
- **Keyword Search**: Search through titles, descriptions, and content
- **Real-time Results**: Instant filtering with live result counts

### 📱 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Automatic theme detection with manual override
- **Smooth Animations**: Elegant transitions and hover effects
- **Loading States**: Professional loading indicators
- **Error Handling**: User-friendly error messages

### 🔐 Authentication
- **Google OAuth**: Secure authentication with Google
- **Session Management**: Persistent login sessions
- **Admin Features**: Special admin-only payout calculator

### 💰 Admin Features
- **Payout Calculator**: Calculate author payouts based on article counts
- **Export Capabilities**: Export data to PDF, CSV, and Google Sheets
- **Rate Management**: Set custom payout rates per author
- **Total Calculations**: Automatic total payout calculations

### 📤 Export Functionality
- **PDF Export**: Generate professional PDF reports
- **CSV Export**: Export data for spreadsheet analysis
- **Google Sheets Integration**: Direct export to Google Sheets (placeholder)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/news-dashboard.git
   cd news-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEWS_API_KEY=your-news-api-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.3.4**: React framework with SSR and routing
- **React 19.0.0**: UI library
- **Tailwind CSS 4.1.10**: Utility-first CSS framework
- **Chart.js 4.5.0**: Interactive charts and graphs
- **React Chart.js 2**: React wrapper for Chart.js

### State Management
- **Redux Toolkit**: Predictable state management
- **React Redux**: React bindings for Redux

### Authentication
- **NextAuth.js**: Complete authentication solution
- **Google OAuth**: Social login provider

### Data & APIs
- **News API**: Real-time news data
- **Axios**: HTTP client for API requests

### Utilities
- **jsPDF**: PDF generation
- **Papa Parse**: CSV parsing and generation
- **date-fns**: Date manipulation utilities

## 📁 Project Structure

```
dashboard-app/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ChartView.js    # Interactive charts
│   │   ├── Navbar.js       # Navigation bar
│   │   └── NewsList.js     # News articles list
│   ├── pages/              # Next.js pages
│   │   ├── api/            # API routes
│   │   ├── _app.js         # App wrapper
│   │   └── index.js        # Home page
│   ├── store/              # Redux store
│   │   ├── index.js        # Store configuration
│   │   └── themeSlice.js   # Theme state management
│   └── styles/             # Global styles
│       └── globals.css     # Global CSS
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
└── README.md              # Project documentation
```

## 🎨 Customization

### Adding New Chart Types
1. Import the chart component from `react-chartjs-2`
2. Add the chart type to the `chartTypes` array in `ChartView.js`
3. Create the corresponding data structure and options
4. Add the chart rendering logic

### Styling
- **Tailwind CSS**: Use utility classes for styling
- **Custom CSS**: Add custom styles in `globals.css`
- **Theme Variables**: Modify CSS custom properties for theming

### API Integration
- **News API**: Currently using News API for US headlines
- **Custom APIs**: Add new API endpoints in `pages/api/`
- **Data Sources**: Extend data fetching in components

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically


### Environment Variables for Production
```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEWS_API_KEY=your-news-api-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [News API](https://newsapi.org/) for providing news data
- [Chart.js](https://www.chartjs.org/) for interactive charts
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for the framework
- [NextAuth.js](https://next-auth.js.org/) for authentication

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/news-dashboard/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Made with ❤️ by [Your Name]**
