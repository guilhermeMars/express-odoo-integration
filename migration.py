# The intention of this file is to not be executed recurrently
# Was made in python for better compatibility with the official Odoo API

import requests
import json
from datetime import datetime
import xmlrpc.client

ODOO_URL = "https://ebramev-corporativo.odoo.com/"
ODOO_DB = "ebramev-corporativo"
ODOO_USERNAME = "marketing3@ebramev.com.br"
ODOO_PASSWORD = "#"

payments_url = "https://api.asaas.com/v3/payments"

# Token de acesso
ASAAS_KEY = "#"

headers = {
    "accept": "application/json",
    "access_token": ASAAS_KEY
}

def fetch_asaas_data(url, params=None):
    """Fetch data from API and return JSON."""
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Levanta um erro se a requisição falhar
        return response.json()
    except Exception as e:
        print(f"Error fetching data from {url}: {e}")
        return None


def get_asaas_paginated_data(url, params=None):
    """Fetch all paginated data from API."""
    all_data = []
    pag = 0
    limit = 100

    while pag < 5:
        params = params or {}
        params.update({"offset": pag, "limit": limit})

        temp_data = fetch_asaas_data(url, params)

        if temp_data is None or not temp_data['data']:
            break

        all_data.extend(temp_data['data'])

        if not temp_data['hasMore']:
            break

        pag += limit
        print(f"Rodou {pag} - {len(temp_data['data'])} registros obtidos.")

    return all_data


# Coletando dados de usuários
usuarios_data = get_asaas_paginated_data(payments_url)  # Já retorna uma lista de dicionários

# Filtrar objetos Python com list comprehensions
output_dict = [i for i in usuarios_data if datetime.strptime(i["dateCreated"], '%Y-%m-%d').date() >= datetime(2025, 1, 1).date()]

# Transformar o objeto Python de volta para JSON formatado
json_indent = json.dumps(output_dict, indent=2)

with open("cobrancas-filtradas-legal.json", "w") as outfile:
    outfile.write(json_indent)


if not ODOO_PASSWORD:
    raise ValueError("API_KEY não está definida nas variáveis de ambiente.")

# Autenticação no Odoo
def odoo_authenticate():
    common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(ODOO_URL))
    uid = common.authenticate(ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {})
    if not uid:
        raise Exception("Failed to authenticate with Odoo")
    return uid


# Criação de uma cobrança no Odoo
user_id = odoo_authenticate()
models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(ODOO_URL))
for item in output_dict:
    created_id = models.execute_kw(
        ODOO_DB,
        user_id,
        ODOO_PASSWORD,
        'x_receitas',
        'create',
        [{
            "x_studio_date": item["dateCreated"],
            "x_name": item["id"],
            "x_studio_descrio": item["description"],
            "x_studio_id_1": item["customer"],
            **({"x_studio_vencimento": item["dueDate"]} if item.get("dueDate") else {}),
            **({"x_studio_data_de_pagamento": item["paymentDate"]} if item.get("paymentDate") else {}),
            **({"x_studio_data_de_crdito": item["creditDate"]} if item.get("creditDate") else {}),
            "x_studio_status": item["status"],
            "x_studio_value": item["value"],
            "x_studio_valor_lquido": item["netValue"],
            **({"x_studio_forma_de_pagamento": item["billingType"]} if item.get("billingType") and item["billingType"] != "UNDEFINED" else {}),
            "x_studio_nmero_da_fatura": int(item.get("invoiceNumber", 0)),
        }]
    )

