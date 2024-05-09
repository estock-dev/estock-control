import { message } from 'antd'
export interface GroupedData {
  [brand: string]: {
    [model: string]: string[];
  };
}

export interface ProductItem {
  marca: string;
  modelo: string;
  nome: string;
  qtd?: number;
}

export function capitalizeFirstLetter(string: string): string {
  return string
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function convertDataToStringUnformatted(data: ProductItem[], includeQty: boolean): string {
  return data.map(item => {
    const brand = capitalizeFirstLetter(item.marca);
    const model = capitalizeFirstLetter(item.modelo.replace(item.marca, '').trim());
    const name = capitalizeFirstLetter(item.nome);
    const quantity = includeQty && item.qtd ? `, Quantidade: ${item.qtd}` : '';
    return `${brand}, ${model}, ${name}${quantity}`;
  }).join(',\n');
}

export function convertDataToString(data: ProductItem[], includeQty: boolean): string {
  const sortedData = [...data].sort((a, b) => {
    const brandA = a.marca.toUpperCase();
    const brandB = b.marca.toUpperCase();
    const modelA = a.modelo.toUpperCase();
    const modelB = b.modelo.toUpperCase();
    const nameA = a.nome.toUpperCase();
    const nameB = b.nome.toUpperCase();

    if (brandA < brandB) return -1;
    if (brandA > brandB) return 1;
    if (modelA < modelB) return -1;
    if (modelA > modelB) return 1;
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  const groupedData: GroupedData = sortedData.reduce((acc: GroupedData, p) => {
    const brand = capitalizeFirstLetter(p.marca);
    const model = capitalizeFirstLetter(p.modelo.replace(p.marca, '').trim());
    const name = capitalizeFirstLetter(p.nome);
    const quantity = includeQty ? ` (Quantidade Disponível: ${p.qtd})` : '';

    if (!acc[brand]) {
      acc[brand] = {};
    }
    if (!acc[brand][model]) {
      acc[brand][model] = [];
    }
    acc[brand][model].push(name + quantity);

    return acc;
  }, {});

  let result = '';
  for (const brand in groupedData) {
    result += `--- ${brand} ---\n`;
    for (const model in groupedData[brand]) {
      result += `Modelo: ${model}\n`;
      const names = groupedData[brand][model].join('\n- ');
      result += `Opções: \n- ${names}\n\n`;
    }
    result += '\n';
  }

  return result.trim();
}


export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    message.success('Lista copiada para o clipboard!');
  }).catch(err => {
    console.error('Error: ', err);
  });
}