#!/usr/bin/env python3
"""Cria um dump de um banco PostgreSQL usando o utilitário ``pg_dump``.

Os parâmetros podem ser fornecidos por argumentos, pelas variáveis PG* padrão
ou por DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_SSL e
DB_CHANNEL_BINDING. A senha nunca é incluída na linha de comando: ela é
passada somente para o processo filho por variável de ambiente.
"""

from __future__ import annotations

import argparse
import getpass
import os
from datetime import datetime
from pathlib import Path
from shutil import which
from subprocess import CalledProcessError, run
from sys import exit as sys_exit


def value_from_argument_or_env(value: str | None, *env_names: str) -> str | None:
    """Prioriza o argumento informado e depois a primeira variável disponível."""
    if value is not None:
        return value
    return next((os.getenv(name) for name in env_names if os.getenv(name) is not None), None)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Gera um dump de um banco PostgreSQL.")
    parser.add_argument("--host", help="Host do PostgreSQL (ou PGHOST)")
    parser.add_argument("--port", type=int, help="Porta do PostgreSQL (ou PGPORT)")
    parser.add_argument("--database", "-d", help="Nome do banco (ou PGDATABASE)")
    parser.add_argument("--user", "-U", help="Usuário (ou PGUSER)")
    parser.add_argument("--password", help="Senha (ou PGPASSWORD). Evite usá-la no histórico do shell.")
    parser.add_argument("--output-dir", default="backups", help="Diretório dos arquivos gerados (padrão: backups)")
    parser.add_argument(
        "--format",
        choices=("custom", "plain"),
        default="custom",
        help="Formato: custom (.dump, padrão) ou plain (.sql)",
    )
    parser.add_argument("--schema", help="Inclui somente este schema")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    database = value_from_argument_or_env(args.database, "PGDATABASE", "DB_NAME")
    if not database:
        print("Erro: informe --database ou defina PGDATABASE.")
        return 2

    pg_dump = which("pg_dump")
    if not pg_dump:
        print("Erro: pg_dump não encontrado. Instale o cliente do PostgreSQL e tente novamente.")
        return 127

    host = value_from_argument_or_env(args.host, "PGHOST", "DB_HOST")
    port = value_from_argument_or_env(str(args.port) if args.port else None, "PGPORT", "DB_PORT")
    user = value_from_argument_or_env(args.user, "PGUSER", "DB_USERNAME")
    password = value_from_argument_or_env(args.password, "PGPASSWORD", "DB_PASSWORD")
    ssl = value_from_argument_or_env(None, "DB_SSL")
    channel_binding = value_from_argument_or_env(None, "DB_CHANNEL_BINDING")

    if password is None and user:
        password = getpass.getpass("Senha do PostgreSQL (Enter para usar .pgpass/autenticação local): ")

    output_dir = Path(args.output_dir).expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_database_name = "".join(char if char.isalnum() or char in "-_" else "_" for char in database)
    extension = "dump" if args.format == "custom" else "sql"
    output_file = output_dir / f"{safe_database_name}_{timestamp}.{extension}"
    if output_file.exists():
        print(f"Erro: o arquivo de destino já existe: {output_file}")
        return 2

    command = [pg_dump, "--dbname", database, "--file", str(output_file)]
    if host:
        command.extend(["--host", host])
    if port:
        command.extend(["--port", port])
    if user:
        command.extend(["--username", user])
    if args.schema:
        command.extend(["--schema", args.schema])
    if args.format == "custom":
        command.extend(["--format", "custom"])

    environment = os.environ.copy()
    if password:
        environment["PGPASSWORD"] = password
    if ssl and ssl.lower() in {"1", "true", "yes", "on"}:
        environment["PGSSLMODE"] = "require"
    if channel_binding:
        environment["PGCHANNELBINDING"] = channel_binding

    try:
        run(command, env=environment, check=True)
    except CalledProcessError as error:
        if output_file.exists():
            output_file.unlink()
            print("O arquivo parcial foi removido.")
        print(f"Erro: pg_dump encerrou com código {error.returncode}.")
        return error.returncode or 1

    print(f"Dump criado com sucesso: {output_file}")
    return 0


if __name__ == "__main__":
    sys_exit(main())
