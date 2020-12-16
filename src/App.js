import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyInput from './CurrencyInput'

const BASE_URL = 'https://api.exchangeratesapi.io/latest'

function App() {
  const[currencyOptions, setOptions] = useState([])
  const[currencyOne, setOne] = useState()
  const[currencyTwo, setTwo] = useState()
  const[amount, setAmount] = useState(1)
  const[amountTwo, setAmountTwo] = useState(true)
  const[conversion, setConvert] = useState()

  let toAmount, fromAmount
  if(amountTwo) {
    fromAmount = amount
    toAmount = amount * conversion
  } else {
    toAmount = amount
    fromAmount = amount / conversion
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        const defaultCurrency = Object.keys(data.rates)[0]
        setOptions([data.base, ...Object.keys(data.rates)])
        setOne(data.base)
        setTwo(defaultCurrency)
        setConvert(data.rates[defaultCurrency])
      })

  }, [])

  useEffect(() => {
    if (currencyOne != null && currencyTwo != null) {
      fetch(`${BASE_URL}?base=${currencyOne}&symbols=${currencyTwo}`)
      .then(res => res.json())
      .then(data => setConvert(data.rates[currencyTwo]))
    }
    
  }, [currencyOne, currencyTwo])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountTwo(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountTwo(false)
  }

  return (
    <>
      <h1>Simple Currency Converter</h1>
      <CurrencyInput
        currencyOptions={currencyOptions}
        selectedCurrency={currencyOne}
        onChangeCurrency={e => setOne(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}      
      />
      <div className="equal">=</div>
      <CurrencyInput
        currencyOptions={currencyOptions}
        selectedCurrency={currencyTwo}
        onChangeCurrency={e => setTwo(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </>
  );
}

export default App;
