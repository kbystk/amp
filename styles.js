const jss = require('jss').default
const preset = require('jss-preset-default').default

jss.setup(preset())
const styles = {
  '@global': {
    a: {
      textDecoration: 'none',
      color: '#0469ea'
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
  },
  level: {
    fontWeight: 'bold'
  },
  'level-2': {
    fontSize: '1.2em',
    lineHeight: '28px'
  },
  'level-3': {
    fontSize: '1.44em',
    lineHeight: '35px'
  },
  'level-4': {
    fontSize: '1.73em',
    lineHeight: '42px'
  },
  'level-5': {
    fontSize: '2.07em',
    lineHeight: '49px'
  },
  'level-6': {
    fontSize: '2.49em',
    lineHeight: '56px'
  },
  'level-7': {
    fontSize: '3em',
    lineHeight: '63px'
  },
  'level-8': {
    fontSize: '3.58em',
    lineHeight: '77px'
  },
  'level-9': {
    fontSize: '4.3em',
    lineHeight: '91px'
  },
  'level-10': {
    fontSize: '5.16em',
    lineHeight: '105px'
  },
  unlinked: {
    color: '#004bad'
  }
}

exports.css = jss.createStyleSheet(styles).attach()
exports.ga = 'UA-96527600-2'
