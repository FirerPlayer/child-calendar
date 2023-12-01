-- -- Criando uma função que será executada pelo trigger
-- CREATE OR REPLACE FUNCTION public.inserir_perfil()
--  RETURNS trigger
--  LANGUAGE plpgsql
-- AS $function$
-- BEGIN
--     INSERT INTO "perfis" (user_id, nome, nome_usuario)
-- 	VALUES (NEW.id, split_part(new.email, '@', 1), split_part(new.email, '@', 1));
--     RETURN NEW;
-- END;
-- $function$;



-- -- Criando um trigger que chama a função sempre que uma nova linha é inserida na tabela user
-- CREATE OR REPLACE TRIGGER inserir_perfil_trigger
-- AFTER INSERT ON "user"
-- FOR EACH ROW EXECUTE FUNCTION inserir_perfil();
