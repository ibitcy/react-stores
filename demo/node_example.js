const { Store } = require('../lib/index');

const dataListStore = new Store({
  dataList: [],
});

dataListStore.setState({
  dataList: [1, 2, 3],
});

dataListStore.saveDump();

dataListStore.resetState();

dataListStore.restoreDump();

console.log(dataListStore.state.dataList);
