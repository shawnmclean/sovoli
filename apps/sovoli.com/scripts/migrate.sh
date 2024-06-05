#!/bin/bash

set -ex
npx --yes prisma migrate deploy --schema apps/sovoli.com/prisma/schema.prisma