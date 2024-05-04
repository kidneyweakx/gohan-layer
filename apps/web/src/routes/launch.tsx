import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { useNavigate } from 'react-router-dom'
import { MintButton, MinerRegister, MineTokenButton } from 'src/components'
import { ERC20Address } from 'src/services/contractAbi'
// import { RegisterButton } from 'src/components/RegisterButton'

export default function Launch() {
  const [inputValue, setInputValue] = useState<string>('')
  const [inputIdValue, setInputIdValue] = useState<string>('')

  const [correctOtherInput, setCorrectOtherInput] = useState<boolean>(true)
  const navigate = useNavigate()

  const handleInputContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

      setInputValue(value)

  }

  const handleIdInputContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputIdValue(value)
  }

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keyword = e.key
    if (keyword=="Enter"){
      handleSubmit()
    }
  }
  const handleSubmit = async () => {
    if (inputValue.trim() !== '') {
     
    
    } else {
      alert('Must input streamer name!')
    }
  }

  const handleRegister = () => {
    if (inputIdValue.trim() !== '') {
      
    } else {
      alert('Must input avail address')
    }
  }

  return (
    <div className='md:max-w-[5120px] w-full bg-cover bg-no-repeat bg-fixed bg-launch min-h-screen grid place-items-start relative'>
      <div className='absolute top-0 left-0 w-full h-full bg-black opacity-50'></div>
      <div className='mx-auto md:max-w-[650px] w-full md:grid grid-row-5 text-center gap-4 rounded-md relative z-10' style={{"padding": "10px"}}>
        <Navbar />
        <div className='row-span-5'></div>
        <label className="font-bold flex" style={{ "color": "white" }}>For no token guys (test)</label>
        <div className='flex flex-col bg-slate-200 rounded-md p-16 h-[300px] bg-cover bg-no-repeat bg-launch-profile shadow-xl gap-3'>
          <p className='text-xl text-start text-white'>Mint your token: </p>
          <p className='text-xl text-start text-white'>Token address {ERC20Address}</p>
          <div className='join gap-4 start'>
            <MintButton/>
          </div>
        </div>
        <label className="font-bold flex" style={{ "color": "white" }}>Register as Miner (need to stake over 100 token)</label>
        <div className='flex flex-col bg-slate-200 rounded-md p-16 h-[200px] bg-cover bg-no-repeat bg-launch-profile shadow-xl gap-3' style={{"marginBottom": "10px"}}>
          {/** multi input with amount and a string */}
          <p className='text-xl text-start text-white'>Input your avail address: </p>
          <div className='join gap-4 start'>
          <input
              type='text'
              placeholder='Type here'
              className='input input-bordered input-info w-full max-w-xs'
              value={inputIdValue}
              onChange={handleIdInputContent}
              onKeyDown={handleEnter}
            />
            <MinerRegister userAddr={inputValue}/>
          </div>
        </div>
        <label className="font-bold flex" style={{ "color": "white" }}></label>
        <div className='flex flex-col bg-slate-200 rounded-md p-16 h-[200px] bg-cover bg-no-repeat bg-launch-profile shadow-xl gap-3'>
          <p className='text-xl text-start text-white'>Input avail hash: </p>
          <div className='join gap-4 start'>
            <input
              type='text'
              placeholder='Type here'
              className='input input-bordered input-info w-full max-w-xs'
              value={inputValue}
              onChange={handleInputContent}
              onKeyDown={handleEnter}
            />
            <MineTokenButton hash={inputValue}/>
            </div>

        </div>
      </div>
    </div>
  )
}
