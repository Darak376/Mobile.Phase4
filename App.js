import { Text, View,ScrollView, Pressable,TextInput } from 'react-native';
import  DatePicker from 'react-native-modern-datepicker';
import { BlurView } from 'expo-blur';
import React, { useState,useEffect } from 'react';
import { PieChart } from "react-native-chart-kit";
import {LinearGradient} from 'expo-linear-gradient';
export default function App() {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [chosenName, setChosenName] = useState("");
  const [chosenCategory, setChosenCategory] = useState("");
  const [chosenAmount, setChosenAmount] = useState(0);
  const [chosenDate, setChosenDate] = useState();
  const [balance, setBalance] = useState(0);
  const [enteringDate, setEnteringDate] = useState(false);
  const [changed, setChanged] = useState(false);
  const [adding_transaction, setAdding_transaction] = useState(false);
  const [transactions, setTransactions] = useState([])
  var totalIncome = 0;
  var totalExpense = 0;
  useEffect(() => {
    setBalance(income + expenses);
  }, [income, expenses])
  useEffect(() => {
    console.log(chosenDate);
  }, [chosenDate])
  const addTransaction = () => {
    // Check if chosenDate already exists in transactions
    const existingTransactionIndex = transactions.findIndex(transaction => transaction.date.toString() === chosenDate.toString());
    console.log(existingTransactionIndex);
    console.log(chosenName)
    console.log(chosenCategory)
    console.log(chosenAmount)
    if (existingTransactionIndex === 0) {
      // If chosenDate exists, update the transaction with new data
      console.log('exists');
      const updatedTransactions = [...transactions];
      updatedTransactions[existingTransactionIndex].transation.push({
        name: chosenName,
        category: chosenCategory,
        amount: parseInt(chosenAmount) // Assuming 'amount' variable is defined elsewhere
      });
      setTransactions(updatedTransactions);
    } else {
      // If chosenDate doesn't exist, create a new object
      console.log('does not exist');
      const newTransaction = {
        date: chosenDate,
        transation: [{
          name: chosenName,
          category: chosenCategory,
          amount: parseInt(chosenAmount) // Assuming 'amount' variable is defined elsewhere
        }]
      };
      setTransactions([...transactions, newTransaction]);
    }
    setAdding_transaction(false);
  };
  const [chartData, setChartData] = useState([
    {
        name: "Expenses",
        amount: 0,
        color: "#e62d20",
        legendFontColor: "white",
        legendFontSize: 15,
    },
    {
        name: "Remaining Income",
        amount: 0,
        color: "#27e620",
        legendFontColor: "white",
        legendFontSize: 15,
    },
]);
useEffect(() => {
  transactions.map((transaction) => {
  const negativeTransactions = transaction.transation.filter(item => item.amount < 0);
  const total_real_Expenses = negativeTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const positiveTransactions = transaction.transation.filter(item => item.amount > 0);
  const total_real_income = positiveTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  totalIncome = totalIncome + total_real_income;
  totalExpense = totalExpense + total_real_Expenses;
  });
  setIncome(totalIncome);
  setExpenses(totalExpense);
  
}, [transactions]);

useEffect(() => {
  setChartData(prevChartData => {
    const updatedChartData = prevChartData.map(data => {
      if (data.name === "Remaining Income") {
        return {
          ...data,
          amount: balance,
        };
      }
      if (data.name === "Expenses") {
        return {
          ...data,
          amount: -expenses,
        };
      }
      return data;
    });
    return updatedChartData;
  });
},[balance]);
  return (
    <LinearGradient colors={['#FF0042','#FB607F']} start={{x: 1, y: 1}} end={{x: 0, y: 0}} className='h-screen w-screen z-0'>
      <BlurView blurRadius={1} className="fixed w-screen h-12 z-20"></BlurView>
      <View className="h-[200px] flex flex-col items-center justify-center p-5">
      <View className=' flex flex-row items-center justify-evenly w-full h-full'>
        <View className=' flex flex-col w-1/3 items-center justify-center border-r-2 border-solid border-red-300'>
          <Text className=' text-white text-xl font-light'>Income</Text>
          <Text className=' text-white text-3xl font-semibold'>${income}</Text>
        </View>
        <View className=' flex flex-col w-1/3 items-center justify-center border-r-2 border-solid border-red-300'>
          <Text className=' text-white text-xl font-light'>Expenses</Text>
          <Text className=' text-white text-3xl font-semibold'>${expenses}</Text>
        </View>        
        <View className=' flex flex-col w-1/3 items-center justify-center'>
          <Text className=' text-white text-xl font-light'>Balance</Text>
          <Text className=' text-white text-3xl font-semibold'>${balance}</Text>
        </View>
      </View>
      </View>
      <ScrollView className=' mt-[150px]'>
      {transactions.map((transaction,index) => {
        const totalExpenses = transaction.transation.reduce((acc, curr) => acc + curr.amount, 0);
        const x =  transaction.transation.length;
        const height = (50 * x) + 50;
          return(
      <View  key={index} className={` h-[${height}px]  mx-5 my-2 rounded-3xl overflow-hidden`}>
      <BlurView intensity={200} className=' w-full p-2 flex flex-col items-center'>
        <ScrollView className=' w-full'>
        <View className=' flex flex-row justify-between items-center  h-[40px] border-b-2 border-solid border-red-200'>
          <Text className=' text-red-100 font-light text-lg '>{transaction.date}</Text>
          <Text className=' text-red-100 font-light text-lg'>Expenses: {totalExpenses}$</Text>
        </View>
        {transaction.transation.map((item,index) => (
        <View key={index} className=' flex flex-row justify-between items-center  h-[50px] border-b-2 border-solid border-red-200'>
          <Text className=' text-white w-1/3 text-center font-medium text-xl'>{item.name}</Text>
          <Text className=' text-white w-1/3 text-center font-medium text-xl'>{item.category}</Text>
          <Text className=' text-white w-1/3 text-center font-medium text-xl'>{item.amount}$</Text>
        </View>
        ))}
        </ScrollView>
      </BlurView>
      </View>
                      )
                    })} 
</ScrollView>
        <Pressable className=' absolute h-[70px] w-[70px] rounded-full bg-red-300 bottom-10 right-5 flex items-center justify-center' onPress={()=>{setAdding_transaction(true)}}>
          <Text className=' text-white text-4xl'>+</Text>
        </Pressable>
        {adding_transaction && 
      <View className=" absolute h-screen w-screen flex flex-col items-center justify-center">
        <View className=" overflow-hidden h-[700px] w-[400px] rounded-3xl">
        <BlurView intensity={40} tint='prominent'  className=" h-full w-full flex flex-col items-center justify-evenly ">
          <Text className="text-5xl font-bold text-white">Add an Expense</Text>
          <View className='flex flex-col justify-center mb-3'>
          <Text className=' text-white text-lg'>Name</Text>
          <TextInput onChangeText={setChosenName} className="w-[300px] h-12 border-2 border-solid bg-white/40 border-blue-200 text-blue-500 px-5 rounded-xl" />
          </View>
          <View className='flex flex-col justify-center mb-3'>
          <Text className=' text-white text-lg'>Category</Text>
          <TextInput onChangeText={setChosenCategory} className="w-[300px] h-12 border-2 border-solid bg-white/40 border-blue-200 text-blue-500 px-5 rounded-xl" />
          </View>
          <View className='flex flex-col justify-center mb-3'>
          <Text className=' text-white text-lg'>Date</Text>
          <Pressable className="w-[300px] flex flex-col justify-center h-12 border-2 border-solid bg-white/40 border-blue-200 text-blue-500 px-5 rounded-xl" onPress={()=>{setEnteringDate(true)}}>
            {chosenDate ? <Text className="text-White text-lg">{chosenDate.toString()}</Text> : <Text className="text-white text-lg">Choose a date</Text>}
            </Pressable>
          </View>
          <View className='flex flex-col justify-center mb-3'>
          <Text className=' text-white text-lg'>Amount</Text>
          <TextInput onChangeText={setChosenAmount} className="w-[300px] h-12 border-2 border-solid bg-white/40 border-blue-200 text-blue-500 px-5 rounded-xl" />
          </View>
          {enteringDate&& <DatePicker date={chosenDate} onDateChange={(val)=>{setChosenDate(val);setEnteringDate(false)}} className=" absolute" />}
          <Pressable className="w-1/2 h-12 bg-[#32c0f9] rounded-xl flex items-center justify-center" onPress={addTransaction} >
            <Text className="text-white text-xl font-bold">Add</Text>
          </Pressable>
          <Pressable className="w-1/2 h-12 bg-red-500 rounded-xl flex items-center justify-center" onPress={()=>{setAdding_transaction(false)}}>
            <Text className="text-white text-xl font-bold">Cancel</Text>
          </Pressable>
        </BlurView>
        </View>
      </View>
}
<View className=' absolute top-[200px] left-[100px] overflow-visible w-full -z-10'>
<PieChart
                data={chartData}
                width={300}
                height={200}
                chartConfig={{
                    backgroundGradientFrom: "#1E2923",
                    backgroundGradientTo: "#08130D",
                    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
</View>
    </LinearGradient>
  );
}
