import os
import requests
import xmlrpc.client

asaas_key = os.getenv("ASAAS_KEY")
odoo_key = os.getenv("ODOO_KEY")

# Asaas connection

url_cobranca = "https://api.asaas.com/v3/payments"

headers = {
    "accept": "application/json",
    "access_token": asaas_key
}

cobranca_data = []

pag = 0
limit = 10


url_pag = f"{url_cobranca}?offset={pag}&limit={limit}&dateCreated[ge]=2022-06-15"
temp_req = requests.get(url_pag, headers=headers)
temp_data = temp_req.json()

# Campos salvos na requisição
cobrancas_filtred = [
    {
        "Identificador": item["id"],
        "Data de criacao": item["dateCreated"],
        "Usuario": item["customer"],
        "Valor": item["value"],
        "Valor original": item["originalValue"],
        "Descricao": item["description"],
        "Tipo de cobranca": item["billingType"],
        "Situacao": item["status"],
        "Vencimento": item["dueDate"],
        "Vencimento original": item["originalDueDate"],
        "Data de Pagamento": item["paymentDate"],
        "Data de credito": item["creditDate"],
        "Forma de pagamento": item["billingType"],
        "Data estimada de Credito": item["estimatedCreditDate"],
        **({"Data de confirmacao": item["confirmedDate"]} if "confirmedDate" in item else {}),
        "Valor Liquido": item["netValue"],
        "Numero da fatura": item["invoiceNumber"]

    } for item in temp_data['data']
]

# Finaliza quando acabar as páginas
if temp_data['hasMore'] == False:
    test = 1

cobranca_data.extend(cobrancas_filtred)

pag+= limit

# Odoo connection

odoo_url = "https://ebramev-corporativo.odoo.com/"
db = "ebramev-corporativo"
username = 'marketing3@ebramev.com.br'

common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(odoo_url))
uid = common.authenticate(db, username, odoo_key, {})

models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(odoo_url))

id = models.execute_kw(db, uid, odoo_key, 'x_receitas', 'create', [{
    'x_name': cobranca_data[0]['Usuario'],
}])
