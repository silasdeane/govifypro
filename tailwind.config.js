module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: '#00C48C',
          nova: '#725CFF',
          alert: '#FF5C5C',
          surface: '#F8FAFC',
        },
        fontFamily: {
          main: ['Inter', 'sans-serif'],
        },
        boxShadow: {
          glass: '0 10px 30px rgba(0,0,0,0.2)',
          soft: '0 4px 12px rgba(0,0,0,0.04)',
        },
        backdropBlur: {
          xs: '4px',
          sm: '8px',
          md: '12px',
          lg: '20px',
        },
        borderRadius: {
          sm: '0.5rem',
          lg: '1rem',
        },
      },
    },
    plugins: [],
  };
  