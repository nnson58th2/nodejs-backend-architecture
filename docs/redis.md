Top 5 câu hỏi phổ biến:

-   Redis là gì? Redis là một cơ sở dữ liệu, nhưng khác với cơ sở dữ liệu truyền thống là được lưu trong bộ nhớ đệm (ram)
    "Thường để cập đến khoá phân tán, transaction, lập lệnh, cluster, ..vv.."
-   Tại sao sử dụng redis và dùng redis để làm cache: Hiệu suất cao và đồng thời cao
    -   Hiệu suất cao: người dùng truy cập vào CSDL để truy xuất dữ liệu quá trình này sẽ chậm hơn vì được đọc từ disk; các lần truy cập tiếp theo sẽ truy cập lấy từ bộ đệm
    -   Đồng thời cao: các yêu cầu bộ đệm hoạt động trực tiếp có thể chịu được bao nhiêu, nhiều hơn so với truy cập vào CSDL. Vì vậy chúng ta có thể xem xét chuyển 1 phần dữ liệu trong CSDL sang bộ nhớ đệm.
-   Memcached vs Redis
-   Redis có bao nhiêu kiểu dữ liệu? Và kịch bản sử dụng?
    -   string (chuỗi): get, set, getm, setm
    -   Hash (băm): hget, hset, hgetall
    -   List (danh sách): lpush, lpop, rpush, rpop
    -   Set (tập hợp)
    -   Zset (tập hợp có thứ tự)
    -   BitMap (mới trong phiên bản 2.2)
    -   HyperLogLog (mới trong phiên bản 2.8)
    -   GEO (mới trong phiên bản 3.2)
    -   Stream (mới trong phiên bản 5.0)
-   Redis giải quyết cơ chế hết hạn dữ liệu thế nào?

### STRING

-   embstring (<= 44 bytes)
    -   SET str 1234566789012345678901234567890123456789abcd
    -   object encoding str -> 'embstr' | 'raw' | 'int'
-   raw (> 44 bytes)
-   int (integer)

-   Thao tác cơ bản trên chuỗi (string)
    -   SET name anonystick
    -   GET name
    -   EXISTS name1 -> "0"
    -   EXISTS name -> "1"
    -   STRLEN name -> "10"
    -   DEL name -> "1"
    -   DEL name1 -> "0"
    -   MSET key1 value1 key2 value2
    -   MGET key1 key2
    -   SET 0001:like 0
    -   INCR 0001:like -> 1
    -   GET 0001:like -> "1"
    -   INCRBY 0001:like 8 -> 9
    -   DECR 0001:like -> 8
    -   DECRBY 0001:like 5 -> 3
    -   KEYS '0001:\*' (tìm kiếm các key)
    -   KEYS 'n\*' -> "num"
    -   EXPIRE name 60 -> 1
    -   TTL name -> 50
    -   SET key value EX 60
    -   SETNX key value1
    -   SET lock_key unique_value NX PX 10000 (hệ thống phân tán)
