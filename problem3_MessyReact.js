interface WalletBalance {
 currency: string;
 amount: number;
}
interface FormattedWalletBalance {
 currency: string;
 amount: number;
 formatted: string;
}

class Datasource {
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
 const { children, ...rest } = props;
 const balances = useWalletBalances();
	const [prices, setPrices] = useState({});

 useEffect(() => {
   const datasource = new Datasource("https://interview.switcheo.com/prices.json");
   datasource.getPrices().then(prices => {
     setPrices(prices);
   }).catch(error => {
     console.err(error);
   });
 }, []);

	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

 const sortedBalances = useMemo(() => {
   return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
   });
 }, [balances, prices]);

 const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
   return {
     ...balance,
     formatted: balance.amount.toFixed()
   }
 })

 const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
   const usdValue = prices[balance.currency] * balance.amount;
   return (
     <WalletRow
       className={classes.row}
       key={index}
       amount={balance.amount}
       usdValue={usdValue}
       formattedAmount={balance.formatted}
     />
   )
 })

 return (
   <div {...rest}>
     {rows}
   </div>
 )
}


List out the computational inefficiencies and anti-patterns found in the code block below.

1. This code block uses
   1. ReactJS with TypeScript.
   2. Functional components.
   3. React Hooks
2. Implement the Datasource class so that it can retrieve the prices required.

3. You should explicitly state the issues and explain how to improve them.

4. You should also provide a refactored version of the code.


My answers:
The code has several inefficiencies and anti-patterns:
a.
if (lhsPriority > -99) {
    if (balance.amount <= 0) {
      return true;
    }
}

for this part of the code, lhsPriority is undefined. It should be balancePriority.

b. console.err(error);
console.err is not a valid function; it should be console.error.

c. The dependencies of useMemo is redundant. Prices is included in useMemo, but sorting does not depend on prices.
Therefore, prices should be removed from the dependencies of useMemo.

d. map() is called twice on sortedBalances. This is inefficient because it iterates over the array twice. Instead we
should merge these operations into one pass.

e. The getPriority function is not efficient. It should be refactored to use a dictionary to store the priorities of
the blockchains.

f. the filtering logic is wrong:
if (balance.amount <= 0) {
  return true;
}

for this part of the code, balance.amount <= 0 should be changed to balanced.amount >= 0.

g. The sorting logic does not consider the case where the priority is the same. Although right now all the priorities is different, in the future there might be a case where the priorities are the same. Therefore, the sorting logic should be updated to consider this case.

h. 
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
  const usdValue = prices[balance.currency] * balance.amount;
  return (
    <WalletRow
      className={classes.row}
      key={index}
      amount={balance.amount}
      usdValue={usdValue}
      formattedAmount={balance.formatted}
    />
  )
})

for this part of the code, it should be formattedBalances.map(). This is because the balance is of type FormattedWalletBalance and below there is the use of "balance.formatted" which is not present in the WalletBalance interface.




Below is the refactored code:

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
 }
 
 interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
 }
 
 class Datasource {
  private apiUrl: string;
 
  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }
 
  async getPrices(): Promise<Record<string, number>> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch prices');
      return response.json();
    } catch (error) {
      console.error('Error fetching prices:', error);
      return {};
    }
  }
 }
 
 const getPriority = (blockchain: string): number => {
  const priorities: Record<string, number> = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
  };
  return priorities[blockchain] ?? -99;
 };
 
 const WalletPage: React.FC = (props) => {
  const { ...rest } = props;
  const balances = useWalletBalances();
  const [prices, setPrices] = useState<Record<string, number>>({});
 
  useEffect(() => {
    const datasource = new Datasource("https://interview.switcheo.com/prices.json");
    datasource.getPrices()
      .then(setPrices)
      .catch(console.error);
  }, []);
 
  // Filter, sort, and format balances in one step
  const formattedBalances = useMemo(() => {
    return balances
      .filter((balance) => getPriority(balance.blockchain) > -99 && balance.amount > 0)
      .map((balance) => {
        const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
        return {
          ...balance,
          formatted: balance.amount.toFixed(),
          usdValue,
        };
      })
      .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain));
  }, [balances]);
 
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })
 
  return (
    <div {...rest}>
      {rows}
    </div>
  )
 }

