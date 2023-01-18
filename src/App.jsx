import React, { useState } from 'react';

import Home from "./components/Home";
import Task from "./components/Task";
import Setting from "./components/Setting";



import logo from "./assets/logo.svg";

import { sidebar } from './config';

const menuicon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-slate-300">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
</svg>


const App = () => {

  const [menu, setMenu] = useState(false);


  const [activeScreen, setActiveScreen] = useState(0);

  // const onFormLayoutChange = ({ size }) => {
  //   setComponentSize(size);
  // };




  return (

    <>

      <div className='flex flex-col lg:flex-row min-h-screen '>

        <div className=' flex bg-sidebar justify-between px-4 items-center lg:justify-start lg:flex-col min-h-[80px] lg:min-h-screen lg:w-[25%] xl:w-[20%]'>

          <div className=' flex items-center justify-around lg:w-full lg:mt-14'>

            <img src={logo}

              className=' w-16 h-16 lg:w-24 lg:h-24 xl:w-28 xl:h-28'
              style={{
                objectFit: 'contain',
              }}
              alt="logo" />

            <h1 className=' text-gray font-dynapuff font-bold text-3xl'>Todo-Ler</h1>

          </div>

          <div className=' hidden lg:flex flex-col items-center mt-40'>
            {
              sidebar.map((screen) => (
                <div key={screen.id} className={` flex items-center cursor-pointer ease-in-out w-60 xl:w-64 space-x-8 rounded-xl py-3 px-5  my-4 ${activeScreen == screen.id ? ' bg-sidebar-gradient  ' : ''
                  }`} onClick={() => setActiveScreen(screen.id)}>

                  {
                    <screen.icon
                      stroke={activeScreen == screen.id ? "cyan" : "white"}
                      width={activeScreen == screen.id ? "32" : "24"}
                      height={activeScreen == screen.id ? "32" : "24"}
                    />}

                  <h2 className={`font-bold font-dynapuff ${activeScreen == screen.id ? ' text-cyan-200 text-2xl' : 'text-gray text-xl'
                    }`}>{screen.name}</h2>

                </div>
              ))
            }
          </div>



          {/* //// Hamberg Menu */}
          <div className=' relative flex lg:hidden justify-center items-center w-12 h-12 cursor-pointer rounded-md bg-slate-700/70'>
            <span onClick={() => setMenu((prev) => !prev)}>{menuicon}</span>

            <div className={`${menu ? 'flex' : 'hidden'} z-10 sidebar top-20 right-0 absolute flex-col items-center w-44 bg-blue-gradient cursor-pointer rounded-2xl`}>
              {
                sidebar.map((screen) => (
                  <div key={screen.id} className={` flex items-center ease-in-out cursor-pointer w-[90%] space-x-4 rounded-2xl py-3 px-2 my-2 ${activeScreen == screen.id ? ' bg-sidebar-gradient  ' : ''
                    }`} onClick={() => setActiveScreen(screen.id)}>

                    {
                      <screen.icon
                        stroke={activeScreen == screen.id ? "cyan" : "black"}
                        width={activeScreen == screen.id ? "24" : "18"}
                        height={activeScreen == screen.id ? "24" : "18"}
                      />}

                    <h2 className={`font-bold font-dynapuff ${activeScreen == screen.id ? ' text-cyan-200 text-xl' : 'text-slate-800 text-xl'
                      }`}>{screen.name}</h2>

                  </div>
                ))
              }
            </div>
          </div>

        </div>



        <div className='w-full lg:w-[80%]'>
          {activeScreen == 0 && <Home />}
          {activeScreen == 1 && <Task />}
          {activeScreen == 2 && <Setting />}
        </div>

      </div>



    </>
  );
};
export default App;