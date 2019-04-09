function getColNum(noteNum) {
  let ctrlrType = getCtrlrType(noteNum);
  let colNum = (noteNum % ctrlrType.matrix.numCols) + 1;
  return  colNum;
}

function getRowNum(noteNum) {
  let rowNum = 1;
  let ctrlrType = getCtrlrType(noteNum);
  let bankNum = getBankNum(noteNum);
  let numCtrInBank = ctrlrType.matrix.numRows * ctrlrType.matrix.numCols;
  let bankMin = ctrlrType.range.min + (numCtrInBank * (bankNum-1));
  let bankMax = ctrlrType.range.min + (numCtrInBank * (bankNum));

  while (rowNum <= ctrlrType.matrix.numRows) {
    let rowMax = bankMin + (ctrlrType.matrix.numCols * rowNum);
    if (noteNum < rowMax) return rowNum;
    rowNum++;
  }
}

function getBankNum(noteNum) {
  let ctrlrType = getCtrlrType(noteNum);
  let numCtrInBank = ctrlrType.matrix.numRows * ctrlrType.matrix.numCols;
  let i = 1;
  while (i <= ctrlrType.banks) {
    let max = ctrlrType.range.min + (numCtrInBank * (i));
    if (noteNum < max) return i;
    i++;
  }
}

function getCtrlrType(noteNum){
  let type;
  for (type in MPD_218) {
    let isInRange = (noteNum >= MPD_218[type].range.min && noteNum < MPD_218[type].range.max);
    if (!MPD_218.hasOwnProperty(type)) continue;
    if (typeof (MPD_218[type]) !== 'undefined' && isInRange) {
      return MPD_218[type];
    }
  }
  return 'ctrlrType error';
}