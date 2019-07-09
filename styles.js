const jss = require('jss').default
const preset = require('jss-preset-default').default

jss.setup(preset())
const styles = {
  '@global': {
    '.line-title': {
      fontSize: '1.5rem',
      textAlign: 'center',
      fontWeight: 'bold'
    },
    '.line': {
      paddingBottom: '.4rem'
    },
    a: {
      textDecoration: 'none',
      color: '#0469ea'
    },
    '.line .quote': {
      fontStyle: 'italic',
      backgroundColor: 'rgba(128,128,128,0.1)',
      display: 'block',
      borderLeft: 'solid 4px #a0a0a0',
      paddingLeft: '4px'
    },
    '.line .code': {
      padding: 0,
      fontSize: '90%',
      backgroundColor: 'rgba(0,0,0,0.04)',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      borderRadius: '4px'
    },
    'amp-img.contain img': {
      objectFit: 'contain'
    }
  },
  container: {
    padding: '1rem'
  },
  '@media (min-width: 640px)': {
    container: {
      maxWidth: '640px',
      margin: '0 auto'
    }
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '.5rem'
  },
  imgContainer: {
    position: 'relative',
    width: '100%',
    height: '30vh'
  },
  sbLink: {
    textAlign: 'center',
    fontSize: '.7rem',
    '& a': {
      color: 'rgba(0, 0, 0, 0.7)',
      textDecoration: 'none'
    }
  }
}

exports.css = jss.createStyleSheet(styles).attach()
exports.ga = 'UA-96527600-2'
