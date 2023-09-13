Top 5 câu hỏi phổ biến:

-   Redis là gì? Redis là một cơ sở dữ liệu, nhưng khác với cơ sở dữ liệu truyền thống là được lưu trong bộ nhớ đệm (ram)
    "Thường để cập đến khoá phân tán, transaction, lập lệnh, cluster, ..vv.."
-   Tại sao sử dụng redis và dùng redis để làm cache: Hiệu suất cao và đồng thời cao
    -   Hiệu suất cao: người dùng truy cập vào CSDL để truy xuất dữ liệu quá trình này sẽ chậm hơn vì được đọc từ disk; các lần truy cập tiếp theo sẽ truy cập lấy từ bộ đệm
    -   Đồng thời cao: các yêu cầu bộ đệm hoạt động trực tiếp có thể chịu được bao nhiêu, nhiều hơn so với truy cập vào CSDL. Vì vậy chúng ta có thể xem xét chuyển 1 phần dữ liệu trong CSDL sang bộ nhớ đệm.
-   Memcached vs Redis
-   Redis có bao nhiêu kiểu dữ liệu? Và kịch bản sử dụng?
    -   string: get, set, getm, setm
    -   Hash: hget, hset, hgetall
    -   List: lpush, lpop, rpush, rpop
    -   ..vv..
-   Redis giải quyết cơ chế hết hạn dữ liệu thế nào?
