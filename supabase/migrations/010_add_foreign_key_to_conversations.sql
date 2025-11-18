-- Add a foreign key constraint to the last_message_id column in the conversations table
ALTER TABLE conversations
ADD CONSTRAINT fk_last_message
FOREIGN KEY (last_message_id)
REFERENCES messages(id);
