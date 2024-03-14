-   sudo amazon-linux-extras install epel -y
-   sudo yum install https://dev.mysql.com/get/mysql80-community-release-el7-5.noarch.rpm
-   sudo yum install mysql-community-server
-   sudo systemctl enable mysqld
-   sudo systemctl start mysqld
-   sudo systemctl status mysqld

-   sudo cat /var/log/mysqld.log | grep "temporary password"
-   ALTER USER root@'localhost' IDENTIFIED WITH mysql_native_password BY 'AaaaBbbb1!';

-   scp -i "~/.ssh/key.pem" ~/Downloads/mysqlsampledatabase.sql ec2-user@ec2-54-221-1223-136.compute-1.amazonaws.com:~/
-   source mysqlsampledatabase.sql

-   CREATE USER 'tipjs'@'localhost' IDENTIFIED WITH mysql_native_password by 'BbbbAaaa1!';
-   GRANT ALL PRIVILEGES ON SHOPDEV.\* TO 'tipjs'@'localhost';
-   CREATE USER 'anonystick'@'%' IDENTIFIED WITH mysql_native_password by '2024Aaaa1!
-   GRANT ALL PRIVILEGES ON \*.\* TO 'anonystick'@'%';
