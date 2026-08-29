# Dump PostgreSQL

O script `postgres_dump.py` usa o cliente oficial `pg_dump`; portanto, instale
o cliente do PostgreSQL antes de executá-lo.

```bash
python3 scripts/postgres_dump.py \
  --host localhost --port 5432 --database meu_banco --user postgres
```

Por padrão, ele cria um arquivo no formato custom em `backups/`, por exemplo
`backups/meu_banco_20260823_153000.dump`. Esse formato pode ser restaurado com:

```bash
pg_restore --host localhost --username postgres --dbname banco_destino --clean backups/meu_banco_20260823_153000.dump
```

Também é possível configurar a conexão por variáveis de ambiente. O script
aceita os nomes padrão do PostgreSQL:

```bash
export PGHOST=localhost PGPORT=5432 PGDATABASE=meu_banco PGUSER=postgres
python3 scripts/postgres_dump.py
```

Ou os nomes usados pela aplicação (útil para Neon):

```bash
export DB_HOST=seu-host-neon
export DB_PORT=5432
export DB_NAME=neondb
export DB_USERNAME=seu_usuario
export DB_PASSWORD=sua_senha
export DB_SSL=true
export DB_CHANNEL_BINDING=require
python3 scripts/postgres_dump.py
```

Para gerar um dump no Neon, use a conexão **sem pooling** no painel. O host
desse endpoint não contém `-pooler`, pois `pg_dump` não deve usar o pool.

Em um arquivo `.env` na raiz do projeto, use essas mesmas linhas. Carregue-o
na sessão atual antes de rodar o script:

```bash
set -a; source .env; set +a
python3 scripts/postgres_dump.py
```

Use `PGPASSWORD` em automações, ou deixe a senha em branco no prompt para que o
PostgreSQL use `.pgpass` ou a autenticação local. Para gerar SQL legível:

```bash
python3 scripts/postgres_dump.py --database meu_banco --format plain
```

## Restaurar em um banco novo

Crie primeiro o banco de destino vazio. Em seguida, defina as variáveis de
conexão de destino no `.env` (para Neon, use o endpoint sem `-pooler`):

```bash
export TARGET_DB_HOST=host-do-banco-novo
export TARGET_DB_PORT=5432
export TARGET_DB_NAME=nome_do_banco_novo
export TARGET_DB_USERNAME=usuario_do_banco_novo
export TARGET_DB_PASSWORD=senha_do_banco_novo
export TARGET_DB_SSL=true
export TARGET_DB_CHANNEL_BINDING=require
```

Carregue o `.env` e informe o arquivo `.dump` válido:

```bash
set -a; source .env; set +a
python3 scripts/postgres_restore.py backups/meu_banco_20260823_153000.dump
```

O script usa `--no-owner` e `--no-privileges`, o que evita falhas ao restaurar
em serviços gerenciados como Neon. O banco de destino deve estar vazio. Para
apagar objetos já existentes antes de restaurar, use `--clean` somente quando
isso for intencional.
