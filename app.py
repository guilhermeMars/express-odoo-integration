from flask import Flask, request, jsonify
import os
import xmlrpc.client


app = Flask(__name__)

ODOO_URL = "https://ebramev-corporativo.odoo.com/"
ODOO_DB = "ebramev-corporativo"
ODOO_USERNAME = "marketing3@ebramev.com.br"
ODOO_PASSWORD = os.getenv("ODOO_KEY")

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
def create_invoice_in_odoo(data):
    user_id = odoo_authenticate()
    models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(ODOO_URL))

    try:
        created_id = models.execute_kw(ODOO_DB, user_id, ODOO_PASSWORD, 'x_receitas', 'create', [{
            'x_name': data.get("customer"),
        }])
    except Exception as e:
        return {"status": "error", "message": str(e)}

    return created_id

@app.route('/asaas/webhook', methods=['POST'])
def asaas_webhook():
    data = request.json
    if data and data.get("event") == "PAYMENT_CREATED":
        if not data.get("customer"):
            return jsonify({"status": "error", "message": "Missing customer data"}), 400
        response = create_invoice_in_odoo(data)
        return jsonify(response)
    return jsonify({"status": "ignored"}), 200

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Porta dinâmica ou 5000 padrão
    app.run(host='0.0.0.0', port=port)
