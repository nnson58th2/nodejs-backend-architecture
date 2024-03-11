-   sudo amazon-linux-extras install epel -y
-   sudo yum install https://dev.mysql.com/get/mysql80-community-release-el7-5.noarch.rpm
-   sudo yum install mysql-community-server
-   sudo systemctl enable mysqld
-   sudo systemctl start mysqld
-   sudo systemctl status mysqld

-   sudo cat /var/log/mysqld.log | grep "temporary password"
-   ALTER USER root@'localhost' INDENTIFIED WITH mysql_native_password BY 'AaaaBbbb1!';
