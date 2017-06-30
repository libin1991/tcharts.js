/**
 * Created by hustcc.
 */

const areaDivide = require('area-divide');
const Chart = require('./Chart');
const { toPercent } = require('../utils/number');
const RectText = require('../core/RectText');
const Point = require('../core/Point');

/**
 * 面积区域占比图
 *
 *  +-------------------+------------+
 *  |                   |    B:10%   |
 *  |                   |            |
 *  |                   |------------+
 *  |       A:75%       |            |
 *  |                   |    C:20%   |
 *  |                   |            |
 *  +-------------------+------------+
 *
 * data 结构：
 [
   {value:335, name:'直接访问'},
   {value:310, name:'邮件营销'},
   {value:274, name:'联盟广告'},
   {value:235, name:'视频广告'},
   {value:400, name:'搜索引擎'},
 ]
 *
 */
class Box extends Chart {
  constructor(width = 100, height = 50) {
    super(width, height);
  }

  setData = (data) => {
    this.data = data;
    // TODO 验证数据合法性
    this.generateLayer();
  };

  /**
   * 具体图表的实现
   */
  generateLayer = () => {
    // 1. 计算总数
    let total = 0;
    this.data.forEach((d) => {
      total += d.value;
    });
    // 2. 计算占比
    this.data.forEach((d) => {
      d.percent = d.value / total;
      d.text = `${d.name}: ${toPercent(d.percent)}`;
    });
    // 3. 降序排序
    this.data.sort((x, y) => y.value - x.value);
    // 4. 瓜分面积
    // 获得比率，然后调用方法瓜分算法
    const percents = this.data.map(e => e.percent);
    const plan = areaDivide(this.width, this.height, percents);

    const layers = plan.map((p, index) => {
      const startPoint = new Point(p.x1, p.y1);
      const endPoint = new Point(p.x2, p.y2);
      const layer = new RectText(startPoint, endPoint, this.data[index].text).draw();
      return layer;
    });

    this.layer.mergeArray(layers);
  };
}

module.exports = Box;