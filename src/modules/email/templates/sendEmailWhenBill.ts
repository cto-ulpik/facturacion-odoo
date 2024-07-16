import { sendEmail } from '../index';

export async function sendEmailWhenBill(props:any){

  
  const dataBill = props.map((item:any) => {

    let htmlContent = '<div>';

    item.relationships['invoice_line_ids'].data.forEach((item:any) => {
    htmlContent += `
    <style type="text/css">
        table {
            width: 100%;
            border-collapse: collapse;
            font-family: Arial, sans-serif;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }
        th {
            background-color: #f2f2f2;
            color: #333;
        }
        tr:nth-child(even) {background-color: #f9f9f9;}
        </style>
        <table>
        <tr>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Código de Producto</th>
        </tr>
        <tr>
            <td>${item.attributes.name}</td>
            <td>${item.attributes.quantity}</td>
            <td>$ ${item.attributes.price_unit}</td>
            <td>${item.relationships.account_id.data.attributes.name_get=='' ? 'No existe el Código' : item.relationships.account_id.data.attributes.name_get}</td>
        </table>
    `;
    });

    htmlContent += '</div>';

    return `<p>Nombre: <h3>${item.relationships['partner_id'].data.attributes.name}</h3></p>
    <p>Correo: ${item.relationships['partner_id'].data.attributes.email}</p>
    <p>Cédula/RUC: ${item.relationships['partner_id'].data.attributes.identifier}</p>
    <p>Fecha: ${item.attributes['date_invoice']}</p>
    <h3>Detalle de la Factura</h3>
    ${htmlContent}

    <p>${JSON.stringify(item.relationships['partner_id'].data.attributes)}</p>
    `
  });

  const mailOptions = {
    to: 'cpa@ulpik.com',
    cc: 'cto@ulpik.com',
    subject: 'NOTIFICACIÓN | Se ha Generado una Factura por Pago en Automático',
    text: 'Se ha Generado una Factura',
    html:`
    <p>Hola Estimada CPA</p>
    <p>Se ha generado la siguiente factura en la plataforma de Odoo</p>
    ${dataBill}
    <p>Saludos,</p>
    `
  };
  
  await sendEmail(mailOptions);
}