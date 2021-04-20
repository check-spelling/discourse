# frozen_string_literal: true

class RenameDeferColumnsOnPostAction < ActiveRecord::Migration[4.2]
  def up
    rename_column :post_actions, :defer_by, :deferred_by_id

    add_column :post_actions, :deferred_at, :datetime
    execute "UPDATE post_actions SET deferred_at = updated_at WHERE defer = 't'"
    remove_column :post_actions, :defer
  end

  def down
    rename_column :post_actions, :deferred_by_id, :defer_by

    add_column :post_actions, :defer, :boolean
    execute "UPDATE post_actions SET defer = 't' WHERE deferred_at IS NOT NULL"
    remove_column :post_actions, :deferred_at
  end
end
