FROM openjdk:17-jdk-oracle

WORKDIR /usr/9gag/back-end

COPY ./target/9gag-0.0.1-SNAPSHOT.jar ./

CMD java -Dspring.profiles.active=prod -jar /usr/9gag/back-end/9gag-0.0.1-SNAPSHOT.jar