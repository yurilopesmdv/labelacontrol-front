import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  :root {
    --primary: #FF69B4; /* Hot Pink */
    --primary-dark: #C71585; /* Medium Violet Red */
    --primary-light: #FFB6C1; /* Light Pink */
    --background: #f0f2f5;
    --text: #333;
    --white: #fff;
    --gray-100: #e1e1e6;
    --gray-300: #a8a8b3;
    --gray-800: #29292e;
    --error: #c53030;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    background: var(--background);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }

  body, input, button {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
  }

  button {
    cursor: pointer;
  }
`;
