import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

import { ConfigProvider, theme } from 'antd';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0066c5',
        },
        components: {
          Form: {
            colorTextHeading: '#000000',
            fontSize: 20,
            fontWeightStrong: 800,
            fontFamily: 'sans-serif',
          }
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)


// components:{
//   Form:{
//     colorBgBase:'#00000'
//   }
// }