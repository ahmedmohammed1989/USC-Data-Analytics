USE SAKILA 
SELECT first_name,last_name FROM actor
SELECT CONCAT(first_name, ' ', last_name) as `Actor Name` FROM actor 
SELECT * FROM actor WHERE last_name CONTAINS "GEN"
SELECT actor_id,first_name,last_name FROM actor WHERE first_name = 'Joe'
SELECT * FROM actor WHERE last_name LIKE '%GEN%';
SELECT last_name,first_name FROM actor WHERE last_name LIKE '%LI%';
SELECT country_id,country FROM country WHERE country IN ('Afghanistan','Bangladesh','China');
ALTER TABLE `sakila`.`actor` ADD COLUMN `middle_name` VARCHAR(45) NULL AFTER `first_name`;
ALTER TABLE `sakila`.`actor` MODIFY middle_name Blob;
ALTER TABLE `sakila`.`actor` DROP COLUMN middle_name;
SELECT last_name, count(*) FROM actor GROUP BY last_name
SELECT last_name, count(*) FROM actor GROUP BY last_name HAVING COUNT(*)>=2 
UPDATE actor SET first_name = 'Harpo' WHERE first_name = 'GROUCHO' AND last_name = 'WILLIAMS';
SELECT last_name, first_name from actor WHERE last_name = 'WILLIAMS'
UPDATE actor SET first_name = CASE WHEN first_name = 'HARPO' THEN 'GROUCHO' ELSE 'MUCHO GROUCHO' END WHERE actor_id = 172;
DESCRIBE sakila.address
SELECT staff.first_name, staff.last_name, address.address FROM staff INNER JOIN address ON staff.staff_id = address.address_id;
SELECT staff.first_name, staff.last_name, payment.payment_date, SUM(amount) FROM staff JOIN payment ON staff.staff_id = payment.staff_id GROUP BY staff.staff_id, first_name, last_name
SELECT film.title, COUNT(film_actor.actor_id) FROM film JOIN film_actor ON film.film_id = film_actor.film_id GROUP BY film.title;
SELECT title, COUNT(inventory_id) FROM film INNER JOIN inventory ON film.film_id = inventory.film_id WHERE title = "Hunchback Impossible";
SELECT customer.last_name, customer.first_name, SUM(payment.amount) FROM customer INNER JOIN payment ON customer.customer_id = payment.customer_id GROUP BY payment.customer_id ORDER BY customer.last_name;
SELECT title FROM film WHERE (title LIKE 'K%' OR title LIKE 'Q%') AND language_id in (SELECT language_id FROM language WHERE name = "English" );
SELECT first_name, last_name FROM actor WHERE actor_id in (SELECT actor_id FROM film_actor WHERE film_id in (SELECT film_id FROM film WHERE title = "Alone Trip"));
SELECT customer.first_name, customer.last_name, customer.email, address.address, country.country FROM customer LEFT JOIN address ON customer.address_id = address.address_id LEFT JOIN city ON address.city_id = city.city_id LEFT JOIN country ON city.country_id = country.country_id WHERE country.country = 'Canada';
SELECT title FROM film_list WHERE category = 'Family';
SELECT film.film_id, film.title, COUNT(rental_id) FROM film JOIN inventory ON film.film_id = inventory.film_id JOIN rental ON rental.inventory_id = inventory.inventory_id GROUP BY film.film_id, film.title ORDER BY COUNT(rental_id) DESC;
SELECT store.store_id, SUM(payment.amount) FROM store JOIN customer ON customer.store_id = store.store_id JOIN payment ON payment.customer_id = customer.customer_id GROUP BY store.store_id ORDER BY SUM(amount);
SELECT store.store_id, country.country, city.city FROM store JOIN address ON store.address_id = address.address_id JOIN city ON city.city_id = address.city_id JOIN country ON city.country_id = country.country_id
SELECT category.name, SUM(payment.amount) FROM category JOIN film_category ON (category.category_id=film_category.category_id) JOIN inventory ON (film_category.film_id=inventory.film_id) JOIN rental ON (inventory.inventory_id=rental.inventory_id) JOIN payment ON (rental.rental_id=payment.rental_id) GROUP BY category.name ORDER BY SUM(payment.amount) LIMIT 5;
CREATE VIEW top_five AS
SELECT category.name, SUM(payment.amount) FROM category JOIN film_category ON (category.category_id=film_category.category_id) JOIN inventory ON (film_category.film_id=inventory.film_id) JOIN rental ON (inventory.inventory_id=rental.inventory_id) JOIN payment ON (rental.rental_id=payment.rental_id) GROUP BY category.name ORDER BY SUM(payment.amount) LIMIT 5;
SELECT * FROM top_five