import downloadWebpImg from "../utils.js";
import assert from 'assert';

// const assert = require('assert');
// const saveWebpImage = require('./saveWebpImage');

describe('saveWebpImage', function() {
  it('should save webp image successfully', async function() {
    const url = "https://i.hamreus.com/ps3/s/SHLJS/VOL_01/SHljs01-001.jpg.webp?e=1682035746&m=zevlP3hpJiOm4o3IrVwwvA"
    const headers = {
        'accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'referer': 'https://www.manhuagui.com/comic/3000/25263.html'
    };

    // const result = await saveWebpImage('https://i.hamreus.com/ps1/j/JQM_DP/01/DlAm01-097b.png.webp?e=1682051317&m=bXNI1gspX3k3xkm0HSbSUw', './image.png');
    await downloadWebpImg(url, headers, '../圣痕炼金士/test.png')
  });
});
