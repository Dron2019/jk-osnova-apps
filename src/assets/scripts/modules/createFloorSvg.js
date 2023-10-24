const getCenterPolygon = polygon => {
    const array = polygon.split(',');
    const points = [];
    array.reduce((acc, point, i) => {
      if (i % 2 === 0) {
        return { x: +point };
      }
      points.push({ ...acc, y: +point });
      return {};
    }, {});
  
    const borderPos = points.reduce((acc, point) => {
      const { x, y } = point;
      const newAcc = { ...acc };
      if (!acc) {
        return {
          left: x,
          top: y,
          right: x,
          bottom: y,
        };
      }
      if (x < newAcc.left) {
        newAcc.left = x;
      }
      if (y < newAcc.top) {
        newAcc.top = y;
      }
      if (x > newAcc.right) {
        newAcc.right = x;
      }
      if (y > newAcc.bottom) {
        newAcc.bottom = y;
      }
      return newAcc;
    }, null);
    const x = ((borderPos.right - borderPos.left) / 2) + borderPos.left;
    const y = ((borderPos.bottom - borderPos.top) / 2) + borderPos.top;
    return { x, y };
  };
  
  const createSoldIcon = ({ x, y }, imageWidth, imageHeight, wrapperSize) => {
    const size = 100;
    const width = imageWidth / wrapperSize.width * size;
    const height = imageHeight / wrapperSize.height * size;
    const updatedX = x - (width / 2);
    const updatedY = y - (height / 2);
    return `<use x=${updatedX} y=${updatedY} width="${width}" height="${height}" xlink:href="#closed"></use>`;
  };
  
  const createInfoIcon = ({ x, y }, imageWidth, imageHeight, wrapperSize, title) => {
    const size = 100;
    const width = imageWidth / wrapperSize.width * size;
    const height = imageHeight / wrapperSize.height * size;
    const updatedX = x - (width / 2);
    const updatedY = y;
    const fontSize = 20;
    const padding = 5;
    return `
    <g style="pointer-events: none">
      <rect rx="8" ry="8" fill="var(--color-bg-darkblue-color)" x=${updatedX} y=${updatedY} height="${fontSize + (padding * 2)}px" width="100px"
        style=" transform: translateY(-${(fontSize + padding - 2)}px) translateX(-17px);
        transform-origin: center;
        transform-box: fill-box;"></rect>
      <text fill="#FFFFFF" style="font-size: ${fontSize}px; font-weight: bold"  x=${updatedX} y=${updatedY}>${title}</text>
    </g>
    `;
  }
  
  function createFloorSvg(i18n, pathImage, flats, sizeImage, activeFlatId, flatIds = []) {
    const imageDefault = `${window.defaultModulePath}/images/examples/no-image.png`;
    if (!sizeImage) {
      return `
      <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" class="s3d-floor__svg">
        <image src=${imageDefault} xlink:href=${imageDefault} x="0" y="0" height="100%" width="100%" ></image>
      </svg>`;
    }
  
    const { 0: imageWidth = 100, 1: imageHeight = 100 } = sizeImage;
  
    const fullPathImage = pathImage;
    const dataAttr = [
      ['section', 'section'],
      ['area', 'area'],
      ['life-area', 'life_room'],
      ['rooms', 'rooms'],
      ['rooms_unit', 'rooms_unit'],
      ['type', 'type'],
      ['id', 'id'],
      ['price', 'price'],
      ['floor', 'floor'],
      ['number', 'number'],
      ['img', 'img_small'],
      ['sale', 'sale'],
    ];
    const numSoldKey = 6;
    const wrapperSize = {
      width: document.documentElement.offsetWidth,
      height: document.documentElement.offsetHeight,
    };
  
    const polygons = flats.map(flat => {


      if (!flatIds.some(el => flat.id == el)) return '';
      const isSold = (flat.sale === numSoldKey);
      const dataAttrFlat = dataAttr.map(([newName, objName]) => `data-${newName}="${flat[objName]}"`).join(' ');
      const polygonClasses = `s3d-flat__polygon ${(isSold ? '' : 'js-s3d-flat__polygon')} ${(activeFlatId == flat.id) ? 's3d-flat-active' : ''}`;
      const roomsCount = flat.rooms;
      return `<polygon class="${polygonClasses} ${roomsCount}" points=${flat.sortedFromServer ? flat.sortedFromServer :flat.sorts} ${dataAttrFlat} data-sold=${isSold} data-tippy-element ></polygon>
      `;
    }).join('');
    const polygonsInfo = flats.map(flat => {
      if (!flatIds.some(el => flat.id == el)) return '';
      const isSold = (flat.sale === numSoldKey);
      const valueToRenderOnPolygon = 'area';
      const posCenterPoly = getCenterPolygon(flat.sortedFromServer ? flat.sortedFromServer :flat.sorts);
      const infoPolygonTitle = createInfoIcon(posCenterPoly, imageWidth, imageHeight, wrapperSize, flat[valueToRenderOnPolygon]);
      return `
      `;
    }).join('');
    const html = `
      <svg viewBox="0 0 ${imageWidth} ${imageHeight}" xmlns="http://www.w3.org/2000/svg" class="s3d-floor__svg">
        <symbol id="closed" viewBox="0 0 30 30">
            <path d="M30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30C23.2843 30 30 23.2843 30 15Z" fill="#A0A6AE"/>
            <path d="M11.8877 13.5517H12.3562V12.1666C12.3562 10.7513 13.5421 9.59961 14.9996 9.59961C16.4578 9.59961 17.6434 10.7511 17.6434 12.1666V13.5517H18.1118C18.3813 13.5517 18.5997 13.7638 18.5997 14.0254V18.7259C18.5997 18.9875 18.3813 19.1996 18.1118 19.1996H11.8876C11.6187 19.1996 11.3997 18.9875 11.3997 18.7259V14.0254C11.3997 13.7638 11.6187 13.5517 11.8877 13.5517ZM16.6677 12.1666C16.6677 11.2734 15.9195 10.5471 14.9997 10.5471C14.08 10.5471 13.3319 11.2734 13.3319 12.1666V13.5517H16.6677V12.1666Z" fill="#2A3341"/>
        </symbol>
        <image src=${fullPathImage} xlink:href=${fullPathImage} x="0" y="0" height="100%" width="100%" ></image>
        ${polygons}
        ${polygonsInfo}
      </svg>`;
    return html;
  }
  
export default createFloorSvg;