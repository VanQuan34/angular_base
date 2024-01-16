class UnitUtils {
  constructor() {

  }

  
  static convertToFloatValue = (inputValue: string, numberToFixed: number = 1) => {
    inputValue = `${inputValue}`;
    // console.log('convertToFloatValue inputValue=', inputValue, '  numberToFixed=', numberToFixed);
    if (!numberToFixed) {
      return parseFloat(inputValue).toFixed(0); 
    }
    const arrNum = inputValue.split('.');
    if (arrNum.length < 2) {
      return parseFloat(inputValue);
    }
    // console.log('convertToFloatValue arrNum=',arrNum, ' length=', arrNum[1].length);
    if (arrNum[1] && arrNum[1].length > 1) {
      return parseFloat(inputValue).toFixed(numberToFixed);
    }
    return parseFloat(inputValue);
  }
}

export {
  UnitUtils
}

