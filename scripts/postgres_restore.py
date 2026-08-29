#!/usr/bin/env python3
"""Restaura um dump custom do PostgreSQL em um banco de destino."""

from __future__ import annotations

import argparse
import os
from pathlib import Path
from shutil import which
from subprocess import CalledProcessError, run
from sys import exit as sys_exit


def env_value(value: str | None, *names: str) -> str | None:
    """Retorna o argumento informado ou a primeira variável definida."""
    if value is not None:
        return value
    return next((os.getenv(name) for name in names if os.getenv(name) is not None), None)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Restaura um arquivo .dump no formato custom em um banco PostgreSQL."
    )
    parser.add_argument("dump_file", type=Path, help="Caminho do arquivo .dump a restaurar")
    parser.add_argument("--host", help="Host de destino (ou TARGET_DB_HOST)")
    parser.add_argument("--port", type=int, help="Porta de destino (ou TARGET_DB_PORT)")
    parser.add_argument("--database", "-d", help="Banco de destino (ou TARGET_DB_NAME)")
    parser.add_argument("--user", "-U", help="Usuário de destino (ou TARGET_DB_USERNAME)")
    parser.add_argument("--password", help="Senha de destino (ou TARGET_DB_PASSWORD)")
    parser.add_argument(
        "--clean",
        action="store_true",
        help="Remove objetos existentes antes de restaurar. Use somente se o destino puder ser apagado.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    dump_file = args.dump_file.expanduser().resolve()
    if not dump_file.is_file():
        print(f"Erro: arquivo de dump não encontrado: {dump_file}")
        return 2

    pg_restore = which("pg_restore")
    if not pg_restore:
        print("Erro: pg_restore não encontrado. Instale o cliente do PostgreSQL.")
        return 127

    database = env_value(args.database, "TARGET_DB_NAME")
    if not database:
        print("Erro: informe --database ou defina TARGET_DB_NAME.")
        return 2

    host = env_value(args.host, "TARGET_DB_HOST")
    port = env_value(str(args.port) if args.port else None, "TARGET_DB_PORT")
    user = env_value(args.user, "TARGET_DB_USERNAME")
    password = env_value(args.password, "TARGET_DB_PASSWORD")
    ssl = env_value(None, "TARGET_DB_SSL")
    channel_binding = env_value(None, "TARGET_DB_CHANNEL_BINDING")

    command = [
        pg_restore,
        "--dbname",
        database,
        "--no-owner",
        "--no-privileges",
        "--exit-on-error",
    ]
    if host:
        command.extend(["--host", host])
    if port:
        command.extend(["--port", port])
    if user:
        command.extend(["--username", user])
    if args.clean:
        command.extend(["--clean", "--if-exists"])
    command.append(str(dump_file))

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
        print(f"Erro: pg_restore encerrou com código {error.returncode}.")
        return error.returncode or 1

    print(f"Dump restaurado com sucesso no banco '{database}'.")
    return 0


if __name__ == "__main__":
    sys_exit(main())
