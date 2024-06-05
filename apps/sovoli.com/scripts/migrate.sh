#!/bin/bash

set -ex
npx --yes prisma migrate deploy --schema app/sovoli.com/prisma/schema.prisma