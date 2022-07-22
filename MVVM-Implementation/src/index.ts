import Binder from './binder';

import ViewModel from './view-model';

const viewModel = new ViewModel({
  data: {
    name: ''
  },
  options: {
    methods: {
      changeName: function () {
        this.setData({
          name: '请输入名称'
        });
      },
      alertName: function () {
        alert(this.data.name);
      }
    }
  }
});

const binder = new Binder({
  el: '#app'
});

binder.bind(viewModel);
