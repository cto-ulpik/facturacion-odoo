class Attributes{
    type: string;
    dataInvoice:any;

    constructor(seed:string){
        this.type = "out_invoice";
        this.dataInvoice = seed.split('').filter((item,index)=>{if(index<10){return item}}).join('')
    }

    getAttribute(){
        return {
            "type":this.type,
            "date_invoice": this.dataInvoice
         }
    }
}



class PartnerId{
    
    //Atributes
    name
    dni
    email
    phone

    constructor(personalData:any){
        this.name = personalData.name
        this.dni = personalData.dni
        this.email = personalData.email
        this.phone = personalData.phone
    }

    getPartnerId(){
        return {
            "data":{
               "type":"res.partner",
               "attributes":{
                  "company_type":"company",
                  "name": this.name,
                  "type_identifier":"cedula",
                  "identifier":this.dni,
                  "street":"",
                  "street2":"",
                  "city":"",
                  "email":this.email,
                  "phone":this.phone,
                  "mobile":this.phone,
                  "customer":true
               },
               "relationships":{
                  "country_id":{
                     "data":{
                        "type":"res.country",
                        "attributes":{
                           "name_get":"Ecuador"
                        }
                     }
                  }
               }
            }
         }
    }
}

class EpaymentId{
    data
    constructor(){
        this.data = {
               "type":"account.epayment",
               "attributes":{
                  "name_get":"OTROS CON UTILIZACION DEL SISTEMA FINANCIERO"
               }
            }
         
    }

    getEpaymentId(){
        return {
            "data":this.data
        }
    }
}

class Product {
    name
    quantity
    priceUnit
    nameGet // sku (en Woocommerce) = name_get (en la API)

    constructor(detailsProduct:any ){
        this.name = detailsProduct.name
        this.quantity = detailsProduct.quantity
        this.priceUnit = (detailsProduct.total/1.15).toFixed(2)
        this.nameGet = detailsProduct.sku.replace('a','').replace('b','').replace('c','')
    }

    getProduct(){
        return {
            "type":"account.invoice.line",
            "relational_command":0,
            "attributes":{
               "name":this.name,
               "quantity":this.quantity,
               "price_unit":this.priceUnit
            },
            "relationships":{
               "account_id":{
                  "data":{
                     "type":"account.account",
                     "attributes":{
                        "name_get":this.nameGet
                     }
                  }
               },
               "invoice_line_tax_ids":{
                  "data":[
                     {
                        "type":"account.tax",
                        "attributes":{
                           "name_get":"VENTAS LOCALES (EXC ACT FIJOS) GRAVADAS TARIFA 15%"
                        }
                     }
                  ]
               }
            }
         }
    }
}
class InvoiceLineIds{
    products:any

    //Datos del Producto
    constructor(payload:any){
        this.products = [];
        payload["line_items"].forEach((item:any,index:number) => {
            this.products.push(new Product(item).getProduct());
        });
    }
    getInvoiceLineIds(){
        return {
            "data": this.products
        }
    }
}

class JournalId{
    data
    constructor(){
        this.data = {
            "type":"account.journal",
            "attributes":{
               "name_get":"Ventas 001-001"
            }
         }
    }
    getJournalId(){
        return {
            "data": this.data
        }
    }
}

class CompanyId{
    data
    constructor(){
        this.data = {
            "type":"res.company",
            "attributes":{
               "name":"IK SAS BIC",
               "name_get":"IK SAS BIC"
            }
        }
    }

    getCompanyId(){
        return {
            "data":this.data
        }
    }
}

class Relationships {
    partnerId
    epaymentId
    invoiceLineIds
    journalId
    companyId

    constructor(payload:any){
        
        let personalDataBilling = {
            name: payload.billing["first_name"],
            dni: payload['meta_data'].filter((item: any)=>item.key=='df_cedula')[0].value,
            email:payload.billing.email,
            phone: payload.billing.phone
        }
        console.log(personalDataBilling)
        this.partnerId = new PartnerId(personalDataBilling).getPartnerId();
        this.epaymentId = new EpaymentId().getEpaymentId();
        this.invoiceLineIds = new InvoiceLineIds(payload).getInvoiceLineIds();
        this.journalId = new JournalId().getJournalId();
        this.companyId = new CompanyId().getCompanyId();
    }

    getRelationships(){
        return {
            "partner_id": this.partnerId,
            "epayment_id": this.epaymentId,
            "invoice_line_ids": this.invoiceLineIds,
            "journal_id": this.journalId,
            "company_id": this.companyId
        }
    }
}

class Data{
    type
    attributes
    relationships
    constructor(auth:any ,payload:any ){
        this.type = "account.invoice"
        this.attributes = new Attributes(auth.seed).getAttribute();
        this.relationships = new Relationships(payload).getRelationships();
    }

    getData(){
        return {
            "type": this.type,
            "attributes": this.attributes,
            "relationships": this.relationships
        }
    }
}

export default function getData(auth:any,payload:any){
    return [
        new Data(auth,payload).getData()
    ]
}


