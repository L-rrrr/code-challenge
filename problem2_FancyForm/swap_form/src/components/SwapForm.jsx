import { useState, useEffect } from "react";
import TokenSelect from "./TokenSelect";
import useFetchPrices from "../hooks/useFetchPrices";
import "./SwapForm.css";
import exchangeIcon from "../assets/exchange-money.svg";

const SwapForm = () => {
  const { tokenPrices, tokens } = useFetchPrices("https://interview.switcheo.com/prices.json");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [fromTokenValue, setFromTokenValue] = useState(0);
  const [toTokenValue, setToTokenValue] = useState(0);

  useEffect(() => {
    if (amount && tokenPrices[fromToken] && tokenPrices[toToken]) {
      const rate = tokenPrices[fromToken] / tokenPrices[toToken];
      const converted = (amount * rate).toFixed(2);
      setConvertedAmount(converted);
      setFromTokenValue((amount * tokenPrices[fromToken]).toFixed(2)); // Price of entered sell amount
      setToTokenValue((converted * tokenPrices[toToken]).toFixed(2)); // Price of received amount 
    } else {
      setConvertedAmount(0);
      setFromTokenValue(0);
      setToTokenValue(0);
    }
  }, [amount, fromToken, toToken, tokenPrices]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Regular expression to allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value); // Update the amount if the input is valid
    }
  };

  const handleKeyDown = (e) => {
    const invalidKeys = ['+', '-', 'e', 'E', ''];
    if (invalidKeys.includes(e.key)) {
      e.preventDefault(); // Prevent invalid keys from being typed
    }
  };

  return (
    <div className="swap-form-container">
      <div className="swap-title-container">
        <h2 className="swap-title">Currency Swap</h2>
      </div>
      <div className="swap-box">
        {/* Sell Section */}
        <div className="swap-section sell-section">
          <label>Sell</label>
          <TokenSelect value={fromToken} onChange={setFromToken} tokens={tokens} />
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter amount"
              value={amount}
              onInput={handleAmountChange} // Use onInput to ensure valid input
              onKeyDown={handleKeyDown} // Use onKeyDown to block invalid keys before they appear
            />
            <div className="token-value-box">
              {amount ? `≈ $${fromTokenValue} SGD` : "Value"}
            </div>
          </div>
        </div>

        {/* Exchange Icon */}
        <img src={exchangeIcon} alt="Exchange" className="exchange-icon" />

        {/* Buy Section */}
        <div className="swap-section buy-section">
          <label>Buy</label>
          <TokenSelect value={toToken} onChange={setToToken} tokens={tokens} />
          <div className="input-container">
            <input type="text" readOnly value={convertedAmount} />
            <div className="token-value-box">
              {amount ? `≈ $${toTokenValue} SGD` : "Value"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapForm;
