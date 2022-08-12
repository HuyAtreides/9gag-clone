FROM mcr.microsoft.com/mssql/server:2019-CU15-ubuntu-20.04

WORKDIR /usr/9gag/database

COPY . ./

ENV ACCEPT_EULA=Y
ENV MSSQL_SA_PASSWORD=1234567z@Z

EXPOSE 1433

CMD [ "/bin/bash", "./start-database.sh" ]
