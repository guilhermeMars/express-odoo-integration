# Use Node.js como base
FROM node:18

# Configuração do ambiente de trabalho
WORKDIR /app

# Copia o package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código para o container
COPY . .

# Expõe a porta utilizada pela aplicação
EXPOSE 5000

# Define a variável de ambiente ODOO_KEY
ENV ODOO_KEY=your_odoo_password_here

# Comando para iniciar o servidor
CMD ["node", "src/app.js"]
