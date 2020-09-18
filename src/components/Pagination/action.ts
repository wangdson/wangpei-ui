/** 计算滚动 */
export function calculateMove(current: number, data: number[], totalPage: number){
  const mid = Math.floor(data.length / 2);
  const temp = current - data[mid];
  let arr;
  if(temp === 0) {
    return null;
  } else if(temp > 0) {
    let last = data[data.length - 1];
    if(last + temp < totalPage) {
      arr = data.map(v => v + temp);
    } else {
      if(last === totalPage) {
        arr = null;
      } else {
        arr = data.map(v => v+totalPage-last);
      }
    }
  } else {
    if(data[0] + temp > 1) {
      arr = data.map(v => v+temp);
    } else {
      if(data[0] === 1) {
        arr = null;
      } else {
        arr = data.map(v=> v - data[0]+1)
      }
    }
  }
  return arr;
}