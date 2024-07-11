import React from 'react';

// importing MyRouts where we located all of our theme
import MyRouts from './routers/routes';
import { GlobalProvider } from "./contexts/GlobalContext"
import { ContractProvider } from "./contexts/ContractContext"
import { WalletProvider } from "./contexts/WalletContext"
import { ToastsProvider } from "./contexts/ToastsContext"

function App() {
  return (
    <div>
      <GlobalProvider>
        <WalletProvider>
          <ContractProvider>
            <ToastsProvider>
              <MyRouts />
            </ToastsProvider>
          </ContractProvider>
        </WalletProvider>
      </GlobalProvider>
    </div>
  );
}

export default App;